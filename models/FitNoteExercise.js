"use strict";
import { notion } from "../clients/notion.js";

export class FitNoteExercise {
  id;
  name;
  notes;
  categoryId;
  lastPerformedDate;
  static categoryMapping;
  static db;

  constructor(dbInput, db) {
    this.id = dbInput.id;
    this.name = dbInput.name;
    this.notes = dbInput.notes;
    this.categoryId = dbInput.category_id;
    if (!FitNoteExercise.db) {
      FitNoteExercise.db = db;
    }
  }

  async getNotionMuscleGroupId() {
    await FitNoteExercise.getExerciseCategoryMapping();
    for (const key in FitNoteExercise.categoryMapping) {
      if (FitNoteExercise.categoryMapping[key] === this.categoryId) {
        return key;
      }
    }
    return null; // Return null if the value is not found
  }

  async getLastPerformedDate() {
    if (!this.lastPerformedDate) {
      const exercises = await FitNoteExercise.db.training_log.findMany({
        where: { exercise_id: this.id },
      });
      exercises.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.lastPerformedDate = exercises.length > 0 ? exercises[0].date : null;
    }
    return this.lastPerformedDate;
  }

  generateRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215);
    const hexColor = randomColor.toString(16).padStart(6, "0");
    const colorInt = parseInt(hexColor, 16);
    return colorInt | 0;
  }

  async update(notionExercise) {
    // Update description, name, muscle category in fitnotes
    await FitNoteExercise.getExerciseCategoryMapping();
    const fitNoteMuscleId =
      FitNoteExercise.categoryMapping[notionExercise.muscle_group.id];
    if (
      this.name !== notionExercise.name ||
      this.notes !== notionExercise.getDescription() ||
      this.categoryId !== fitNoteMuscleId
    ) {
      await FitNoteExercise.db.exercise.update({
        where: { id: this.id },
        data: {
          name: notionExercise.name,
          notes: notionExercise.getDescription(),
          category_id: fitNoteMuscleId,
        },
      });
    }
  }

  async delete() {
    await FitNoteExercise.db.exercise.delete({ where: { id: this.id } });
  }

  static async getExerciseCategoryMapping() {
    if (!FitNoteExercise.db) throw new Error("DB connection not set");
    if (!FitNoteExercise.categoryMapping) {
      const fitNoteCategories = await FitNoteExercise.db.category.findMany({});

      const fnCategoryLookup = fitNoteCategories.reduce((acc, category) => {
        acc[category.name.toLowerCase().trim()] = category;
        return acc;
      }, {});

      const notionDb = await notion.databases.retrieve({
        database_id: process.env.NOTION_DATABASE_ID,
      });

      const options = notionDb["properties"]["Muscle Group"].select.options;
      const mapping = {};

      for (let notionCategory of options) {
        const name = notionCategory.name.toLowerCase().trim();
        let matchingFitNoteCategory =
          name in fnCategoryLookup ? fnCategoryLookup[name] : undefined;

        if (!matchingFitNoteCategory) {
          const color = this.generateRandomColor();
          matchingFitNoteCategory = await FitNoteExercise.db.category.create({
            data: {
              name: notionCategory.name,
              colour: color,
            },
          });
        }

        mapping[notionCategory.id] = matchingFitNoteCategory.id;
      }
      FitNoteExercise.categoryMapping = mapping;
    }
  }

  static async create(notionExercise) {
    if (!FitNoteExercise.db) throw new Error("DB connection not set");
    await FitNoteExercise.getExerciseCategoryMapping();
    const notionCategory =
      FitNoteExercise.categoryMapping[notionExercise.muscle_group.id];

    if (!notionCategory) {
      throw new Error(
        `${notionExercise.name} could not be created in fitnotes becuase it lacks a category`
      );
    }

    const created = await FitNoteExercise.db.exercise.create({
      data: {
        name: notionExercise.name,
        notes: notionExercise.getDescription(),
        category_id: notionCategory,
      },
    });
    return new FitNoteExercise(created);
  }
}
