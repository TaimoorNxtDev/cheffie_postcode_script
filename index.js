
const mysql = require('mysql2');
const util = require('util')
const csv = require('csvtojson');

const csvFilePath = 'postcodes.csv';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'stage_db',
    connectionLimit: 10,
  
});

const query = util.promisify(connection.query).bind(connection);

/**
 * @param object csv object as param 
 */
const CreateDataInTable = async (obj) => {
    try {

        let d =await query(`SHOW VARIABLES LIKE 'max_allowed_packet';`)
        const rows = obj.map((data) => [data.lng, data.lat, data.post_code, data.city_id, data.created_at, data.updated_at]);
        
        const sql = `INSERT INTO post_codes (lng, lat, post_code, city_id , created_at, updated_at) VALUES ?`;
        await query(sql, [rows])
        console.log('DONE WITH BULK UPLOADING')
    } catch (error) {
        console.log(error)
    } finally {
        await connection.close()
    }

}





const CsvReader = async () => {
    try {
        
    const data = await csv().fromFile(csvFilePath)
    let array_postcodes = data.map((el) => {
        let obj = {
            city_id: 18,
            lat: parseFloat(el.Latitude),
            lng: parseFloat(el.Longitude),
            post_code: el.Postcode,
            created_at : new Date(),
            updated_at : new Date()
        }
        return obj;
    })
    await CreateDataInTable(array_postcodes)


    } catch (error) {
        console.log(error , 'here is error');
    }

}


CsvReader()



