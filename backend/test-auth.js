const axios = require('axios');

const BASE_URL = 'http://localhost:8082/auth';

const generateRandomEmail = () => `testuser_${Date.now()}@example.com`;

const testData = {
  email: generateRandomEmail(),
  password: 'password123',
  role: 'CUSTOMER', // Default role for standard registration
};

async function testAuth() {
  console.log('--- Bắt đầu Test Auth ---');

  try {
    // 1. Test Đăng ký (Register)
    console.log(`\n[1] Đang test Đăng ký cho email: ${testData.email}...`);
    const registerResponse = await axios.post(`${BASE_URL}/register`, {
      email: testData.email,
      password: testData.password,
      role: testData.role
    });
    
    console.log('✅ Đăng ký thành công!');
    console.log('Dữ liệu trả về (Register):', JSON.stringify(registerResponse.data, null, 2));

    // 2. Test Đăng nhập (Login)
    console.log(`\n[2] Đang test Đăng nhập với email: ${testData.email}...`);
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: testData.email,
      password: testData.password
    });

    console.log('✅ Đăng nhập thành công!');
    console.log('Dữ liệu trả về (Login):', JSON.stringify(loginResponse.data, null, 2));
    
    console.log('\n--- Hoàn tất Test ---');

  } catch (error) {
    console.error('❌ Lỗi API:', error.message);
    if (error.response) console.error('Chi tiết response:', error.response.data);
  }
}

testAuth();
