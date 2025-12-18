USE [ATXDADOS];
GO
IF OBJECT_ID('dbo.vw_Vendas_Combustiveis_Dia', 'V') IS NOT NULL
    DROP VIEW dbo.vw_Vendas_Combustiveis_Dia;
GO
CREATE VIEW dbo.vw_Vendas_Combustiveis_Dia
AS
SELECT
    f.ID_FILIAL                              AS ID_FILIAL,
    f.RAZAOSOCIALFILIAL                      AS NOMEFILIAL,
    p.ID_PRODUTOS                            AS ID_PRODUTO,
    p.NOMEPRODUTO                            AS NOMEPRODUTO,
    CONVERT(date, l.DTACONTA)                AS DATA,
    CAST(SUM(ISNULL(b.VENDAS, 0)) AS decimal(18,3))                    AS VOLUME_LITROS,
    CAST(SUM(ISNULL(b.VENDAS, 0) * ISNULL(b.PPL, 0)) AS decimal(18,2)) AS VALOR_TOTAL_RS
FROM dbo.LMCBICOS b
INNER JOIN dbo.LMC l
    ON l.ID_LMC = b.ID_LMC
INNER JOIN dbo.PRODUTOS p
    ON p.ID_PRODUTOS = l.ID_PRODUTOS
INNER JOIN dbo.FILIAIS f
    ON f.ID_FILIAL = l.ID_FILIAL
WHERE
    p.ATIVO = 1
    AND p.ID_LOCALVENDAS = 1
GROUP BY
    f.ID_FILIAL,
    f.RAZAOSOCIALFILIAL,
    p.ID_PRODUTOS,
    p.NOMEPRODUTO,
    CONVERT(date, l.DTACONTA);
GO
