const oracledb = require('oracledb');
const conexao = require('./conexao');


async function prereq(peca) {
    let connection;

    try {
        let sql, binds, options, result, array;

        connection = await oracledb.getConnection(conexao);

        if (typeof peca.cdMaterial != 'string' && typeof peca.cdMaterial != 'undefined') {
            array = [];
            for (i = 0; i < peca.cdMaterial.length; i++) {
                sql = `WITH CTE AS(
                    SELECT
                        COLUMN_VALUE PECA
                    FROM
                        TABLE(
                            SYS.DBMS_DEBUG_VC2COLL(
                            :1
                            )
                        )
                ),
                PRICE AS(
                    SELECT
                        *
                    FROM
                (
                            SELECT
                                CD_MATERIAL,
                                FOB,
                                EFFECTIVE_DT,
                                ROW_NUMBER() OVER (
                                    PARTITION BY CD_MATERIAL,
                                    UF_CD
                                    ORDER BY
                                        EFFECTIVE_DT DESC
                                ) RN
                            FROM
                                KMTB_KMB_PARTS_PRICE PRICE
                            WHERE
                                CD_MATERIAL IN (
                                    SELECT
                                        PECA
                                    FROM
                                        CTE
                                )
                                AND UF_CD = 'SP'
                        )
                    WHERE
                        RN = 1
                )
                SELECT
                    CTE.PECA,
                    PMA.PART_FORMAT "PMA (Opcional)",
                    WSK.CD_MATERIAL "WSK (Obrigatorio)",
                    WSK.ID_STATUS "WSK STATUS (=0)",
                    EBS_MA.SEGMENT1 "EBS MASTER (Obrigatorio)",
                    EBS_04.SEGMENT1 "EBS B04 (Obrigatorio)",
                    COUNT(DISTINCT UF.CD_ESTADO) "SEK_UF (>=16)",
                    PRI.EFFECTIVE_DT "PARTS_PRICE (ultimo)",
                    MAX(SEK.DT_VIGENCIA_INICIAL) "SEK_PRICE (ultimo)",
                    PRI.FOB "FOB"
                FROM
                    CTE
                    LEFT JOIN KMTB_PMA PMA ON CTE.PECA = PMA.PART_FORMAT
                    LEFT JOIN KMTB_PARTS WSK ON WSK.CD_MATERIAL = CTE.PECA
                    LEFT JOIN SEK_UF UF ON UF.CD_PRODUTO = CTE.PECA
                    LEFT JOIN PRICE PRI ON PRI.CD_MATERIAL = CTE.PECA
                    LEFT JOIN SEK_PRICE SEK ON SEK.CD_PRODUTO = CTE.PECA
                    AND SEK.CD_PRODUTO = WSK.CD_MATERIAL
                    LEFT JOIN APPS.MTL_SYSTEM_ITEMS_B @K2PRD EBS_MA ON EBS_MA.SEGMENT1 = CTE.PECA
                    AND EBS_MA.ORGANIZATION_ID = 147
                    LEFT JOIN APPS.MTL_SYSTEM_ITEMS_B @K2PRD EBS_04 ON EBS_04.SEGMENT1 = CTE.PECA
                    AND EBS_04.ORGANIZATION_ID = 151
                GROUP BY
                    CTE.PECA,
                    PMA.PART_FORMAT,
                    WSK.CD_MATERIAL,
                    WSK.ID_STATUS,
                    EBS_MA.SEGMENT1,
                    PRI.EFFECTIVE_DT,
                    EBS_04.SEGMENT1,
                    UF.CD_PRODUTO,
                    PRI.FOB
                ORDER BY
                    9 asc,
                    1`;

                binds = [
                    peca.cdMaterial[i]
                ];

                options = {
                    autoCommit: true,
                    extendedMetaData: true
                };
                result = await connection.execute(sql, binds, options);


                array.push(result.rows);

            }
            return array;
        } else {
            sql = `WITH CTE AS(
                SELECT
                    COLUMN_VALUE PECA
                FROM
                    TABLE(
                        SYS.DBMS_DEBUG_VC2COLL(
                        :1
                        )
                    )
            ),
            PRICE AS(
                SELECT
                    *
                FROM
            (
                        SELECT
                            CD_MATERIAL,
                            FOB,
                            EFFECTIVE_DT,
                            ROW_NUMBER() OVER (
                                PARTITION BY CD_MATERIAL,
                                UF_CD
                                ORDER BY
                                    EFFECTIVE_DT DESC
                            ) RN
                        FROM
                            KMTB_KMB_PARTS_PRICE PRICE
                        WHERE
                            CD_MATERIAL IN (
                                SELECT
                                    PECA
                                FROM
                                    CTE
                            )
                            AND UF_CD = 'SP'
                    )
                WHERE
                    RN = 1
            )
            SELECT
                CTE.PECA,
                PMA.PART_FORMAT "PMA (Opcional)",
                WSK.CD_MATERIAL "WSK (Obrigatorio)",
                WSK.ID_STATUS "WSK STATUS (=0)",
                EBS_MA.SEGMENT1 "EBS MASTER (Obrigatorio)",
                EBS_04.SEGMENT1 "EBS B04 (Obrigatorio)",
                COUNT(DISTINCT UF.CD_ESTADO) "SEK_UF (>=16)",
                PRI.EFFECTIVE_DT "PARTS_PRICE (ultimo)",
                MAX(SEK.DT_VIGENCIA_INICIAL) "SEK_PRICE (ultimo)",
                PRI.FOB "FOB"
            FROM
                CTE
                LEFT JOIN KMTB_PMA PMA ON CTE.PECA = PMA.PART_FORMAT
                LEFT JOIN KMTB_PARTS WSK ON WSK.CD_MATERIAL = CTE.PECA
                LEFT JOIN SEK_UF UF ON UF.CD_PRODUTO = CTE.PECA
                LEFT JOIN PRICE PRI ON PRI.CD_MATERIAL = CTE.PECA
                LEFT JOIN SEK_PRICE SEK ON SEK.CD_PRODUTO = CTE.PECA
                AND SEK.CD_PRODUTO = WSK.CD_MATERIAL
                LEFT JOIN APPS.MTL_SYSTEM_ITEMS_B @K2PRD EBS_MA ON EBS_MA.SEGMENT1 = CTE.PECA
                AND EBS_MA.ORGANIZATION_ID = 147
                LEFT JOIN APPS.MTL_SYSTEM_ITEMS_B @K2PRD EBS_04 ON EBS_04.SEGMENT1 = CTE.PECA
                AND EBS_04.ORGANIZATION_ID = 151
            GROUP BY
                CTE.PECA,
                PMA.PART_FORMAT,
                WSK.CD_MATERIAL,
                WSK.ID_STATUS,
                EBS_MA.SEGMENT1,
                PRI.EFFECTIVE_DT,
                EBS_04.SEGMENT1,
                UF.CD_PRODUTO,
                PRI.FOB
            ORDER BY
                9 asc,
                1`;

            binds = [
                peca.cdMaterial
            ];

            options = {
                autoCommit: true,
                extendedMetaData: true
            };
            result = await connection.execute(sql, binds, options);

            return result.rows;
        }

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

async function insere_sekUF(dados) {
    lstUF = [ ["3","AM"], ["4","BA"], ["5","CE"], ["6","DF"], ["7","ES"], ["9","GO"], ["10","MG"], ["11","MS"], ["12","MT"], ["14","PB"], ["15","PE"], ["16","PR"], ["17","RJ"], ["21","RS"], ["22","SC"], ["24","SP"] ]
    let connection;

    try {
        let sql, binds, options, result, array;
        connection = await oracledb.getConnection(conexao);
        
        for (i = 0; i < lstUF.length; i++){
            sql = `INSERT INTO SEK_UF(cd_produto, cd_estado, class_preco) VALUES (:1,:2,:3)`;
                            

            binds = [
                dados,
                lstUF[i][1],
                lstUF[i][0]
            ];

            options = {
                autoCommit: true,
                extendedMetaData: true
            };
            result = await connection.execute(sql, binds, options);

        }
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

async function insertKmtbParts(dados){
    let connection;

    try {
        let sql, binds, options, result;
        connection = await oracledb.getConnection(conexao);

        sql = `INSERT INTO KMTB_CALCULATE_PARTS (CD_MATERIAL,PROCUREMENT_FACTORY_CD, EFFECTIVE_DT,FOB,CURRENCY_CD) VALUES (:1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4, :5)`;

        binds = [
            dados.cdMaterial,
            dados.procurement_factory_cd,
            dados.effectiveDate,
            dados.fob,
            dados.currency_cd
        ];

        options = {
            autoCommit: true,
            extendedMetaData: true
        }
        result = await connection.execute(sql, binds, options);

        return result;
    } catch (err){
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

async function selectPartsPrice(dados){
    let connection;
    
    try{
        let sql, binds, options, result, array;

        connection = await oracledb.getConnection(conexao);

        array = [];

        sql = `select * from kmvw_kmb_parts_price where cd_material= :1`;

        binds = [
            dados.cdMaterial
        ];

        options = {
            autoCommit: true,
            extendedMetaData: true
        };

        result = await connection.execute(sql, binds, options);

       return result.rows;
    } catch(err){
        console.log(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.log (err);
            }
        }
    }
}

module.exports = {
    prereq: prereq,
    insere_sekUF: insere_sekUF,
    insertKmtbParts: insertKmtbParts,
    selectPartsPrice: selectPartsPrice
}