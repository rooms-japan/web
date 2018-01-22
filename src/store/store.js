import api from './api';

const store = {
  init: () => {
    api.init();
  },

  get: async (key, params) => {
    let value, error;

    [value, error] = await api.get(key, params);

    return new Promise((resolve, reject) => {
      value != null ? resolve(value) : reject(error);
    });
  }
};

export default store;
