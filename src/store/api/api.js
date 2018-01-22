import config from '../../config';
import checkStatus from '../../utils/check-fetch-status';

const api = {
  init: () => {},
  get: async (key, params) => {
    let value, error;

    let resource;
    switch (key) {
      case 'columns':
      case 'wards':
        resource = `info/${key}`;
        break;

      case 'data':
        resource = `hello/${params.xcol}/${params.ycol}/${params.ward}`;
        break;

      default:
        resource = key;
        break;
    }

    try {
      value = await fetch(`${config.url.api}/${resource}`, {
        method: 'GET'
      })
        .then(checkStatus)
        .then(res => res.json());
    } catch (err) {
      error = err;
    }

    return [value, error];
  }
};

export default api;
