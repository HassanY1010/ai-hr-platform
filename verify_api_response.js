import axios from 'axios';

async function verify() {
    const userId = '2b0ebb0d-bb34-41fb-8933-0f2f05a6c94a'; // User ID for حسن محمد بارفعه
    const url = `http://localhost:4000/api/employees/${userId}/tasks`;

    console.log(`Fetching from: ${url}`);
    try {
        const response = await axios.get(url);
        console.log('--- RAW RESPONSE BODY ---');
        console.log(JSON.stringify(response.data, null, 2));

        console.log('\n--- DATA ANALYSIS ---');
        console.log('Status:', response.data.status);
        console.log('Data type:', typeof response.data.data);
        if (response.data.data) {
            console.log('Data keys:', Object.keys(response.data.data));
            console.log('Is .data.tasks an array?', Array.isArray(response.data.data.tasks));
        }
    } catch (error) {
        console.error('Fetch failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

verify();
