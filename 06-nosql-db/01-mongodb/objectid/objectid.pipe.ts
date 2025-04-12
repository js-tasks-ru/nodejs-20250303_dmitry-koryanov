import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import mongoose, { Types } from "mongoose";

@Injectable()
export class ObjectIDPipe implements PipeTransform {
  transform(value: string) {
    const objectIdIsValid = mongoose.Types.ObjectId.isValid(value);
    if (objectIdIsValid) {
      return new Types.ObjectId(value);
    } else {
      throw new BadRequestException("not a valid object id");
    }
  }
}
