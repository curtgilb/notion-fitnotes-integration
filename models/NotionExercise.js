"use strict";
import { notion } from "../clients/notion.js";

export class NotionExercise {
  // Class methods and properties go here
  id;
  rating;
  last_performed;
  fitnotes_id;
  muscle_group;
  description;
  video;
  targeted_muscles;
  source;
  name;

  constructor(dbInput) {
    this.id = dbInput.id;
    this.name = dbInput.properties["Name"].title[0]?.text.content;
    this.rating = dbInput.properties["Rating"].number;
    this.last_performed = dbInput.properties["Last Performed"].date?.start;
    this.fitnotes_id = dbInput.properties["FitNotes ID"].number;
    this.muscle_group = {
      name: dbInput.properties["Muscle Group"].select?.name,
      id: dbInput.properties["Muscle Group"].select?.id,
    };
    this.description =
      dbInput.properties["Description"].rich_text[0]?.plain_text;
    this.video = dbInput.properties["Video"].url;
    this.targeted_muscles = dbInput.properties[
      "Targeted Muscle"
    ].multi_select.map((item) => item.name);
    this.source = dbInput.properties["Source"].multi_select?.map(
      (item) => item.name
    );
  }

  getDescription() {
    if (
      this.targeted_muscles.length === 0 &&
      this.description === null &&
      this.video === null &&
      this.source === null
    )
      return null;

    return `
      TARGETED MUSCLE:
        ${this.targeted_muscles.join()}
      DESCRIPTION:
        ${this.description ? this.description : ""}
      VIDEO:
        ${this.video ? this.video : ""}
      SOURCE:
        ${this.source ? this.source.join("\n") : ""}
      `;
  }

  async update(fitNoteExercise) {
    const properties = {};

    // Add the updated date if it is not the same
    const lastPerformed = await fitNoteExercise.getLastPerformedDate();
    if (lastPerformed && this.last_performed !== lastPerformed) {
      properties["Last Performed"] = {
        date: {
          start: lastPerformed,
          end: null,
          time_zone: null,
        },
      };
    }

    if (this.fitnotes_id !== fitNoteExercise.id) {
      properties["FitNotes ID"] = { number: fitNoteExercise.id };
    }

    if (Object.keys(properties).length > 0) {
      const result = await notion.pages.update({
        page_id: this.id,
        properties,
      });
    }
  }

  static async create(fitnote) {
    const lastPreformedDate = await fitnote.getLastPerformedDate();
    return await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: fitnote.name,
              },
            },
          ],
        },
        "FitNotes ID": { number: fitnote.id },
        "Muscle Group": {
          select: { id: await fitnote.getNotionMuscleGroupId() },
        },
        "Last Performed": {
          date: {
            start: lastPreformedDate,
          },
        },
      },
    });
  }
}
