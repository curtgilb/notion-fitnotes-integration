"use strict";
import { notion } from "../clients/notion.js";
import { NotionExercise } from "../models/NotionExercise.js";
import { FitNoteExercise } from "../models/FitNoteExercise.js";

export class Synchronizer {
  constructor(db) {
    this.db = db;
  }

  async syncNotionAndFitNotes() {
    const notionExercises = await this.getNotionExercises();
    const fitNoteExercises = await this.getFitNoteExercises();
    const { matched, unmatchedNotionExercises, unmatchedFitNoteExercies } =
      this.matchExercises(notionExercises, fitNoteExercises);

    await this.importNewExercisesToFitnote(unmatchedNotionExercises);
    await this.syncPreviouslyMatched(
      notionExercises,
      fitNoteExercises,
      matched
    );
    await this.importExerciseToNotion(
      unmatchedFitNoteExercies,
      fitNoteExercises
    );
  }

  // {ID => Exercise}
  async getNotionExercises() {
    const exercises = [];
    let hasMoreExerciesToFetch = true;
    let nextCursor = null;

    while (hasMoreExerciesToFetch) {
      const result = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
        start_cursor: nextCursor ?? undefined,
        page_size: 100,
      });

      exercises.push(result.results);
      hasMoreExerciesToFetch = result.has_more;
      nextCursor = result.next_cursor;
    }

    return exercises.flat().reduce((acc, exercise) => {
      acc[exercise.id] = new NotionExercise(exercise);
      return acc;
    }, {});
  }

  // {ID => Exercise}
  async getFitNoteExercises() {
    const exercises = await this.db.exercise.findMany();
    return exercises.reduce((acc, exercise) => {
      acc[exercise.id] = new FitNoteExercise(exercise, this.db);
      return acc;
    }, {});
  }

  // {notionCategoryId -> fitNoteCategoryId }
  matchExercises(notionExercises, fitNoteExercises) {
    // {notionId => FitNoteId}
    const matched = {};
    const unmatchedNotionExercises = [];
    const unmatchedFitNoteExercies = [];

    const fitNoteExercisesArray = Object.values(fitNoteExercises);
    for (let notionExercise of Object.values(notionExercises)) {
      // Check for previously matched id first
      if (!Number.isNaN(parseInt(notionExercise.fitnotes_id))) {
        matched[notionExercise.id] = notionExercise.fitnotes_id;
      }
      // Check for matching names
      else {
        const match = fitNoteExercisesArray.find(
          (fitNoteExercise) => fitNoteExercise.name === notionExercise.name
        );

        if (match) {
          matched[notionExercise.id] = match.id;
        }
        // Consider it unmatched.
        else {
          unmatchedNotionExercises.push(notionExercise);
        }
      }
    }

    for (let [fitNoteId, fitNoteExercise] of Object.entries(fitNoteExercises)) {
      if (!Object.values(matched).includes(parseInt(fitNoteId))) {
        unmatchedFitNoteExercies.push(fitNoteExercise);
      }
    }
    return { matched, unmatchedNotionExercises, unmatchedFitNoteExercies };
  }

  async importNewExercisesToFitnote(unmatchedNotionExercises) {
    // Create the unmatched Notion exercises in DB and update notion exercise with matching FitNote ID
    const imports = unmatchedNotionExercises.map(
      (exercise) =>
        new Promise(async (resolve, reject) => {
          try {
            const createdExercise = await FitNoteExercise.create(exercise);
            await exercise.update(createdExercise);
          } catch (e) {
            console.log(e);
            reject();
          }
          resolve();
        })
    );
    await Promise.allSettled(imports);
  }

  // Update matching exercises with the notion description in fitnotes and update the last performed date in from fitnotes to notion
  async syncPreviouslyMatched(notionExercises, fitnoteExercises, matches) {
    const updates = Object.entries(matches).map(([notionId, fitNoteId]) => {
      return new Promise(async (resolve, reject) => {
        try {
          const notion = notionExercises[notionId];
          const fitNote = fitnoteExercises[fitNoteId];
          await notion.update(fitNote);
          await fitNote.update(notion);
          resolve();
        } catch (e) {
          console.log(e);
          reject();
        }
      });
    });

    await Promise.allSettled(updates);
  }

  // Create performed FitNote exercises in Notion
  async importExerciseToNotion(unmatchedFitNoteExercies) {
    const performedExercises = new Set(
      (
        await this.db.training_log.findMany({
          where: {},
          distinct: ["exercise_id"],
        })
      ).map((exercise) => exercise.exercise_id)
    );

    const tasks = unmatchedFitNoteExercies.map((unmatchedFitnote) => {
      return new Promise(async (resolve, reject) => {
        if (performedExercises.has(unmatchedFitnote.id)) {
          try {
            await NotionExercise.create(unmatchedFitnote);
          } catch (e) {
            console.log(e);
            reject();
          }
        }
        resolve();
      });
    });

    await Promise.allSettled(tasks);
  }
}
