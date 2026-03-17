const axios = require('axios');

async function testAuth() {
  try {
    const registerRes = await axios.post('http://localhost:8080/auth/register', {
      email: 'test@snapbook.com',
      password: 'mystrongpassword'
    });
    console.log('Register Success:', registerRes.data);
  } catch (error) {
    console.log('Register Error:', error.response ? error.response.data : error.message);
  }

  try {
    const loginRes = await axios.post('http://localhost:8080/auth/login', {
      email: 'test@snapbook.com',
      password: 'mystrongpassword'
    });
    console.log('Login Success:', loginRes.data);
  } catch (error) {
    console.log('Login Error:', error.response ? error.response.data : error.message);
  }
}

testAuth();
