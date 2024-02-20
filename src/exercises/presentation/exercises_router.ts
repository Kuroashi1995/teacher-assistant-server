import { NextFunction, Request, Response, Router } from "express";
import { ExercisesUseCase } from "../application/exercises_use_case";
const mime = require("mime-types");
import path = require("path");
import { PdfService } from "core/services/pdf";
const fs = require("fs");

export default function exercisesRouter({
  exercisesUseCase,
}: {
  exercisesUseCase: ExercisesUseCase;
}) {
  const exercisesRouter = Router();

  exercisesRouter.post(
    "/quick-exercise",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { description } = req.body;
        //Todo: create unique names to files with user id and datetime
        const pdfPath = __dirname + "\\temp\\quick-exercise.pdf";
        const completion = await exercisesUseCase.createQuickExercise({
          exDesc: description,
          pdfPath: pdfPath,
        });
        //This is the manual way to do a download with the stream
        // const filename = path.basename(pdfPath);
        // const fileType = mime.lookup(pdfPath);
        // console.log({ filename, fileType });
        // res.setHeader(
        //   "Content-Disposition",
        //   `attachment; filename=${filename}`
        // );
        // res.setHeader("Content-type", fileType);
        // let fileStream = fs.createReadStream(pdfPath);
        // fileStream.pipe(res);
        res.download(pdfPath, () => {
          fs.unlink(pdfPath, () => {
            console.log("deleted");
          });
        });
      } catch (e) {
        throw new Error(`Could not create quick exercise: ${e}`);
      }
    }
  );
  return exercisesRouter;
}
