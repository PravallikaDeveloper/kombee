
export function setStorage(key, value) {
  let data = getStorage("products");
  if(data) {
    data.push(value);
  }
  else {
    data = [value];
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function getStorage(key) {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
}

export function clearStorage(key) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}
