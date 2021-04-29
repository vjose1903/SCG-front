import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SingletonService } from '../services/singleton.service';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

export class CrudG<T> {
  http = SingletonService.http;

  constructor(public path: string) {}

  async getAll(arg, tipo = 'backend') {
    let url = this.makeUrl(tipo, arg);
    return (await this.request(url, 'get').toPromise()) as T[];
  }

  async getOne(id = '', arg = null, tipo = 'backend') {
    let url = this.makeUrl(tipo, arg, id);
    return (await this.request(url, 'get').toPromise()) as T;
  }

  async deleteOne(id = '', arg = null, tipo = 'backend') {
    let url = this.makeUrl(tipo, arg, id);
    return (await this.request(url, 'delete').toPromise()) as T;
  }

  async createOne(data, arg = null, tipo = 'backend') {
    let url = this.makeUrl(tipo, arg);
    return (await this.request(url, 'post', data).toPromise()) as T;
  }

  async updateOne(data, arg = null, tipo = 'backend') {
    let url = this.makeUrl(tipo, arg, data.id);
    return (await this.request(url, 'patch', data).toPromise()) as T;
  }

  parseParams(arg) {
    let params = '';

    for (const key in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, key)) {
        const value = arg[key];

        if (params.length === 0) params += `?${key}=${value}`;
        else params += `  &${key}=${value}`;
      }
    }
    return params;
  }

  makeUrl(tipo, args?, id = null) {
    let url = `${environment.backend_url}/${this.path}`;
    if (tipo === 'externo') return this.path;

    if (id) url += `/${id}`;
    if (_.has(args, 'afterPath')) url += `/${args.afterPath}`;
    if (_.has(args, 'parameters')) url += this.parseParams(args.parameters);

    return url;
  }

  request(url, method, data?: any): Observable<any> {
    const metodo = method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE' ? 1 : 2;

    switch (metodo) {
      case 1:
        return this.http[method](url, this.defaultHeaders());
        break;

      case 2:
        return this.http[method](url, JSON.stringify(data), this.defaultHeaders());
        break;
    }
  }

  defaultHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    };
  }
}
