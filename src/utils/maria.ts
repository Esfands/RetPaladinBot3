import { pool } from "../main";

export function insertRow(query: string, values: any[]) {
  pool.getConnection()
    .then(conn => {
      conn.query(query, values)
        .then((rows) => {
          if (rows.length) {
            console.log(rows, values);
            return true;
          } else {
            return false;
          }
        })
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err)
          conn.end();
        })
    }).catch(err => {
      //not connected
      console.log("not connected");
    });
}

export async function asyncInsertRow(query: string, values: any[]) {
  let conn;
  let data;
  try {
    conn = await pool.getConnection();
    return await conn.query(query, values);
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
      return data;
    }
  }
}


export async function updateOne(query: string) {
  let conn;
  let data;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(query);
    if (rows) {
      data = rows;
    } else data = false;
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
      return data;
    }
  }
}

export function findAndUpdate(findQuery: string, updateQuery: string) {
  pool.getConnection()
    .then(conn => {
      conn.query(findQuery)
        .then((rows) => {
          if (rows.length) {
            return conn.query(updateQuery);
          } else {
            return false;
          }
        })
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err)
          conn.end();
        })
    }).catch(err => {
      //not connected
      console.log("not connected");
    });
}

export async function removeOne(table: string, toSearch: string, values: any[]) {
  let conn;
  let data;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(`DELETE FROM ${table} WHERE ${toSearch};`, values);
    if (rows.length) {
      data = true;
    } else data = false;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end()
    return data;
  }
}

export async function findOne(table: string, toSearch: string) {
  let conn;
  let data;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(`SELECT * FROM ${table} WHERE ${toSearch} LIMIT 1;`);
    if (rows.length) {
      data = rows[0];
    } else data = false;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end()
    return data;
  }
}

export async function findColumn(table: string, column: string) {
  let conn;
  let data;
  try {
    conn = await pool.getConnection();
    let rows = await conn.query(`SELECT ${column} FROM ${table}`);
    if (rows) {
      data = rows;
    } else data = false;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
    return data;
  }
}

export async function findQuery(query: string) {
  let conn;
  let data;
  try {
    conn = await pool.getConnection();
    let toFetch = await conn.query(query); 
    data = toFetch;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
    return data;
  }
}

export function find(table: string) {
  pool.getConnection()
    .then(conn => {
      conn.query(`SELECT * FROM ${table}`)
        .then((rows) => {
          console.log(rows); //[ {val: 1}, meta: ... ]
          if (rows) {
            return rows;
          } else return false;
        })
        .then((res) => {
          console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err);
          conn.end();
        })

    }).catch(err => {
      //not connected
    });
}







/** Searches if row exists, if it doesn't create
 * 
 * @param table table to search
 * @param toFind find where value = variable
 * @param query string to add to table
 * @param values values from query string.
 * @returns true if found, false if created
 */
export async function findOrCreate(table: string, toFind: string, query: string, values: any[]) {
  pool.getConnection()
    .then(conn => {
      conn.query(`SELECT * FROM ${table} WHERE ${toFind};`)
        .then((rows) => {
          if (rows.length) {
            return true;
          } else {
            conn.query(query, values);
            return false;
          }
        })
        .then((res) => {
          conn.end();
        })
        .catch(err => {
          //handle error
          console.log(err);
          conn.end();
        })
    }).catch(err => {
      //not connected
      console.log("not connected");
    });
}
