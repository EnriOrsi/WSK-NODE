const oracledb = require('oracledb');
const conexao = require('./conexao');


async function orderDetail(dados) {
    let connection;

    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(conexao);

        sql = `
        select case when rnum_hide = '1' then cd_pedido else null end as cd_pedido,
                       case when rnum_hide = '1' then sequencia else null end as sequencia,
                       case when rnum_hide = '1' then trunc(dt_pedido) else null end as dt_pedido,
                       case when rnum_hide = '1' then tp_pedido else null end as tp_pedido,
                       case when rnum_hide = '1' then cd_cliente else null end as cd_cliente,
                       case when rnum_hide = '1' then cfop else null end as cfop,
                       case when rnum_hide = '1' then cd_material else null end as cd_material,
                       case when rnum_hide = '1' then cd_material_alt else null end as cd_material_alt,
                       case when rnum_hide = '1' then pedido_qty else null end as pedido_qty,
                       case when rnum_hide = '1' then cancel_qty else null end as cancel_qty,
                       case when rnum_hide = '1' then si_qty else null end as si_qty,
                       case when rnum_hide = '1' then bo_qty else null end as bo_qty_for_desc,
                       bo_qty,
                       nf_qty,
                       nf,
                       dt_nf,
                       rnum_hide,
                       rnum_desc
               from (
               select a.cd_pedido, b.line_pedido as sequencia, substr(b.tp_op,1,4) as cfop,
                       case when substr(b.tp_op,2,3) =  '949' then 'GARANTIA'
                           when substr(b.tp_op,2,3) <> '949' then 'NORMAL'
                       end as tp_pedido,
                       a.dt_pedido, a.cd_cliente, b.cd_material,
                       un.cd_material_sub as cd_material_alt,
                       b.qtd_pedido as pedido_qty, nvl(c.qtd_can,0) as cancel_qty, nvl(d.qtd_si,0) as si_qty,
                       case when b.qtd_pedido - nvl(c.qtd_can, 0) <= nvl(g.tl_qtd_nf, 0)
                       then 0
                       else b.qtd_pedido - nvl(c.qtd_can, 0) - nvl(d.qtd_si, 0)
                       end as bo_qty,
                       e.qtd_nf as nf_qty, e.nf, f.dt_nf,
                       row_number() over(partition by a.cd_pedido, to_number(b.line_pedido), b.cd_material order by e.nf ) rnum_hide,
                       row_number() over(order by a.cd_pedido desc, a.dt_pedido desc , to_number(b.line_pedido), e.nf ) rnum_desc
               from  kmtb_pedido_hdr a
               left outer join kmtb_pedido_dtl b
               on a.cd_pedido = b.cd_pedido
               left outer join (
                   select a.cd_pedido, a.line_pedido, sum(a.cancel_qtd) as qtd_can
                   from  kmtb_pedido_can_dtl a
                   left outer join kmtb_pedido_can_hdr b
                   on a.cancel_no = b.cancel_no
                   where b.dt_cancel >= TO_DATE(:1, 'DD/MM/YYYY')
                   group by a.cd_pedido, a.line_pedido
               ) c
               on b.cd_pedido = c.cd_pedido and
                   b.line_pedido = c.line_pedido
               left outer join (
                   select a.cd_pedido, a.line_pedido,
                           sum( case when a.qtd_coletado <> 0 then a.qtd_coletado
                                   when a.qtd_coletado = 0  then a.qtd_si
                                   else 0  end ) as qtd_si
                   from  kmtb_ship_inst_dtl a
                   left outer join kmtb_ship_inst_hdr b
                   on a.ship_inst_no = b.ship_inst_no
                   where a.id_status <> '2' and
                       b.dt_ship_instruction >= TO_DATE(:2, 'DD/MM/YYYY')
                   group by a.cd_pedido, a.line_pedido
               ) d
               on b.cd_pedido = d.cd_pedido and
                   b.line_pedido = d.line_pedido
               left outer join kmif_nf_saida_dtl e
               on b.cd_pedido = e.cd_pedido and
                   b.line_pedido = e.line_pedido
               left outer join kmif_nf_saida_hdr f
               on e.nf = f.nf and
                   e.serie = f.serie
                   left outer join (
                   select a.cd_pedido, a.line_pedido, sum(a.qtd_nf) as tl_qtd_nf
                   from kmif_nf_saida_dtl a
                   left outer join kmif_nf_saida_hdr b
                   on a.nf = b.nf
                   where b.dt_nf >= to_date(:3, 'DD/MM/YYYY')
                   group by a.cd_pedido, a.line_pedido
                   ) g
                   on b.cd_pedido = g.cd_pedido and
                       b.line_pedido = g.line_pedido
                   left outer join (
                   select a.cd_material, b.cd_material_sub
                   from kmtb_parts a
                   inner join kmtb_substitute_parts b
                   on a.cd_material = b.cd_material
                   where a.substitute_tp = 'U'  and
                               b.id_status = '0'
                   ) un
                   on b.cd_material = trim(un.cd_material)
                   where a.dt_pedido <   TO_DATE(:4, 'DD/MM/YYYY') + 1 and
                       a.dt_pedido >=  TO_DATE(:5, 'DD/MM/YYYY')
       
               )
               where 1=1 `;

               binds = [
                    dados.fromDate,
                    dados.fromDate,
                    dados.fromDate,
                    dados.toDate,
                    dados.fromDate
               ]

               if (dados.cdPedido != null) {
                    binds.push(dados.cdPedido);
                   sql += ` and trim(cd_pedido) <= UPPER(:6)`;
               }

               sql += ` and rnum_desc != 150 order by rnum_desc `;
               
               result = await connection.execute(sql, binds);

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

module.exports = {
    'orderDetail' : orderDetail
}