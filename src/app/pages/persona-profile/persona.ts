import { CrudG } from '../../core/typescript/crud-g';
import * as _ from 'lodash';
import { data } from 'jquery';
export interface PersonaI {
  id?: Number;
  nombre: String;
  apellido: String;
  fecha_nacimiento: String;
  usuario: String;
  telefono: String;
  email: String;
  direccion: String;
  estado?: String;
  es_estudiante?: Boolean;
  es_invitado?: Boolean;
  es_empleado?: Boolean;
  connnnooo?: Boolean;
  password?: String;
  password_confirmation?: String;
}

export class AuthC extends CrudG<any> {
  constructor() {
    super('auth');
  }
}

export class PersonaC extends CrudG<PersonaI> {
  arrayKeys = [];
  constructor(public data?: PersonaI) {
    super('persona');
    if (data) this.setArray();
  }

  setArray() {
    this.arrayKeys = _.keys(this.data);
  }

  get_campos(array) {
    const obj = {};

    for (const iterator of this.arrayKeys) {
      if (_.includes(array, iterator) && _.has(this.data, iterator)) obj[iterator] = this.data[iterator];
    }

    return obj;
  }

  getVehiculosPersona() {
    this.getAll(`${this.data.id}/vehiculos`).then();
  }
}
