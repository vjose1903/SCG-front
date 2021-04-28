import { environment } from 'src/environments/environment';
import { CrudG } from '../../core/typescript/crud-g';
export interface OcrI {
  responses: Array<any>;
}

export class OcrC extends CrudG<OcrI> {
  constructor() {
    super(`https://content-vision.googleapis.com/v1/images:annotate?alt=json&key=${environment.apiKeyGoogle}`);
  }
}
