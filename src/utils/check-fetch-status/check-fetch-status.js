export default async res => {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    let error = new Error(res.statusText);
    error.response = res;

    error.response.data = await res.json();

    throw error;
  }
};
