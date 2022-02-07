const oracledb = require('oracledb');
const conexao = require('./conexao');


async function login(dados) {
    let connection;

    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(conexao);

        sql = `SELECT *
            FROM 
                kmtb_auth_user
            WHERE 
                user_name= :1 
            AND 
            user_password= :2`;


        binds = [
            dados.user_name,
            dados.user_password
        ];

        options = {
            autoCommit: true,
            extendedMetaData: true
        };

        result = await connection.execute(sql, binds, options);



        return result.rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function buscaUsuario(dados) {
    let connection;

    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(conexao);

        sql = `SELECT
                id,
                display_name,
                user_name,
                user_mail,
                user_enable
            FROM 
                kmtb_auth_user
            WHERE 
                user_name= :1 
            AND 
                user_enable= :2`;


        binds = [
            dados.user_name,
            dados.user_enable
        ];

        options = {
            autoCommit: true,
            extendedMetaData: true
        };

        result = await connection.execute(sql, binds, options);



        return result.rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function permissaoUsuario(dados) {
    let connection;

    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(conexao);

        sql = `SELECT b.DISPLAY_NAME as GROUPNAME, b.ID as GROUPID, c.DISPLAY_NAME as ROLENAME, c.ID as ROLEID, C.DETAIL  FROM KMTB_GROUP_ROLE a INNER JOIN KMTB_AUTH_GROUP b ON b.ID = a.ID_GROUP INNER JOIN KMTB_AUTH_ROLES c ON a.ID_ROLE = c.ID INNER JOIN KMTB_USER_ROLES d ON d.ID_ROLE = a.ID_ROLE WHERE d.ID_USER = :1 ORDER BY b.ID, c.ID`;

        binds = [
            dados.id
        ];

        options = {
            autoCommit: true,
            extendedMetaData: true
        };

        result = await connection.execute(sql, binds, options);



        return result.rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function updateUser(dados) {
    let connection;

    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(conexao);

        sql = `UPDATE kmtb_auth_user SET display_name = :1, user_mail = :2, user_password = :3 WHERE user_name = :4 `;


        binds = [
            dados.display_name,
            dados.user_mail,
            dados.user_password,
            dados.user_name
        ];

        options = {
            autoCommit: true,
            extendedMetaData: true
        };

        result = await connection.execute(sql, binds, options);

        console.log('Numero de linhas alteradas: ' + result.rowsAffected);

        return result.rowsAffected;
    } catch (err) {
        console.log(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = {
    login: login,
    buscaUsuario: buscaUsuario,
    permissaoUsuario: permissaoUsuario,
    updateUser: updateUser
}