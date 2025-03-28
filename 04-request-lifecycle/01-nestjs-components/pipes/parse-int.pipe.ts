import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): number {
    // console.log('MyIntPipePipe', value);
    const int = parseInt(value, 10);

    if (isNaN(int)) {
      throw new BadRequestException(`"${value}" не является числом`);
    }
    return int;
  }
}
