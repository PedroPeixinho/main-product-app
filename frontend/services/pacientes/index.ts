import api from "..";

export class PacienteService {
  static async getPacientes() {
    const { data } = await api.get("/pacientes", {
      validateStatus: (status) =>
        [200, 204, 401, 403, 404, 500].includes(status),
    });
    if (data) return data;
    else return [];
  }

  static async getDuvidas() {
    const { data } = await api.get("/pacientes/duvidas", {
      validateStatus: (status) =>
        [200, 204, 401, 403, 404, 500].includes(status),
    });
    if (data) return data;
    else return [];
  }

  static async getConsultas() {
    const { data } = await api.get("/pacientes/consultas", {
      validateStatus: (status) =>
        [200, 204, 401, 403, 404, 500].includes(status),
    });
    if (data) return data;
    else return [];
  }
}
