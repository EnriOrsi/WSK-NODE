const oracledb = require('oracledb');
const conexao = require('./conexao');


async function prereq(peca) {
    let connection;

    try {
        let sql, binds, options, result, array;

        connection = await oracledb.getConnection(conexao);

        if (typeof peca.cdMaterial != 'string' && typeof peca.cdMaterial != 'undefined'){
            array = [];
            for (i=0;i<peca.cdMaterial.length;i++){
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



module.exports = {
    prereq: prereq
}