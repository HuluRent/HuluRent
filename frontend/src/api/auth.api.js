import client from './client';

export async function login(email, password) {
  const { data } = await client.post('/auth/login', {
    email,
    password,
  });

  return data;
}

export async function register(displayName, email, password) {
  const { data } = await client.post('/auth/register', {
    displayName,
    email,
    password,
  });

  return data;
}
