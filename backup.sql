--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

-- Started on 2025-05-18 22:17:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 16388)
-- Name: pgagent; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA pgagent;


ALTER SCHEMA pgagent OWNER TO postgres;

--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA pgagent; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA pgagent IS 'pgAgent system tables';


--
-- TOC entry 2 (class 3079 OID 16389)
-- Name: pgagent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgagent WITH SCHEMA pgagent;


--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgagent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgagent IS 'A PostgreSQL job scheduler';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 238 (class 1259 OID 24840)
-- Name: uni_categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uni_categorias (
    id integer NOT NULL,
    nome character varying(250) NOT NULL
);


ALTER TABLE public.uni_categorias OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 24843)
-- Name: uni_clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uni_clientes (
    id integer NOT NULL,
    nome_completo character varying(60),
    nome_social character varying(60),
    data_nascimento timestamp(6) without time zone,
    email character varying(64),
    cpf character varying(15),
    rg character varying(15),
    telefone numeric
);


ALTER TABLE public.uni_clientes OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 24848)
-- Name: uni_enderecos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uni_enderecos (
    id integer NOT NULL,
    cep numeric,
    logradouro character varying(168),
    numero numeric,
    estado character varying(64),
    cidade character varying(168),
    bairro character varying(64),
    referencia character varying(64),
    id_usuario integer
);


ALTER TABLE public.uni_enderecos OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 24853)
-- Name: uni_clientes_enderecos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.uni_clientes_enderecos AS
 SELECT c.id,
    c.nome_completo,
    c.email,
    e.logradouro,
    e.cidade,
    e.estado,
    e.cep
   FROM (public.uni_clientes c
     JOIN public.uni_enderecos e ON ((c.id = e.id)));


ALTER VIEW public.uni_clientes_enderecos OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 24857)
-- Name: uni_login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uni_login (
    login character varying(200),
    senha character varying(200)
);


ALTER TABLE public.uni_login OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24860)
-- Name: uni_lojas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uni_lojas (
    id integer NOT NULL,
    nome character varying(250) NOT NULL
);


ALTER TABLE public.uni_lojas OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 24863)
-- Name: uni_produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uni_produtos (
    id integer NOT NULL,
    nome_produto character varying(128),
    descricao_produto character varying(128),
    valor_produto numeric
);


ALTER TABLE public.uni_produtos OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 24868)
-- Name: uni_ticket; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uni_ticket (
    id integer NOT NULL,
    id_pedido numeric,
    assunto character varying(64),
    descricao character varying(168),
    categoria character varying(64)
);


ALTER TABLE public.uni_ticket OWNER TO postgres;

--
-- TOC entry 4812 (class 0 OID 16390)
-- Dependencies: 223
-- Data for Name: pga_jobagent; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobagent (jagpid, jaglogintime, jagstation) FROM stdin;
6388	2025-05-18 13:11:34.696728-03	DESKTOP-DPUIGC7
\.


--
-- TOC entry 4813 (class 0 OID 16399)
-- Dependencies: 225
-- Data for Name: pga_jobclass; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobclass (jclid, jclname) FROM stdin;
\.


--
-- TOC entry 4814 (class 0 OID 16409)
-- Dependencies: 227
-- Data for Name: pga_job; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_job (jobid, jobjclid, jobname, jobdesc, jobhostagent, jobenabled, jobcreated, jobchanged, jobagentid, jobnextrun, joblastrun) FROM stdin;
\.


--
-- TOC entry 4816 (class 0 OID 16457)
-- Dependencies: 231
-- Data for Name: pga_schedule; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_schedule (jscid, jscjobid, jscname, jscdesc, jscenabled, jscstart, jscend, jscminutes, jschours, jscweekdays, jscmonthdays, jscmonths) FROM stdin;
\.


--
-- TOC entry 4817 (class 0 OID 16485)
-- Dependencies: 233
-- Data for Name: pga_exception; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_exception (jexid, jexscid, jexdate, jextime) FROM stdin;
\.


--
-- TOC entry 4818 (class 0 OID 16499)
-- Dependencies: 235
-- Data for Name: pga_joblog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_joblog (jlgid, jlgjobid, jlgstatus, jlgstart, jlgduration) FROM stdin;
\.


--
-- TOC entry 4815 (class 0 OID 16433)
-- Dependencies: 229
-- Data for Name: pga_jobstep; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobstep (jstid, jstjobid, jstname, jstdesc, jstenabled, jstkind, jstcode, jstconnstr, jstdbname, jstonerror, jscnextrun) FROM stdin;
\.


--
-- TOC entry 4819 (class 0 OID 16515)
-- Dependencies: 237
-- Data for Name: pga_jobsteplog; Type: TABLE DATA; Schema: pgagent; Owner: postgres
--

COPY pgagent.pga_jobsteplog (jslid, jsljlgid, jsljstid, jslstatus, jslresult, jslstart, jslduration, jsloutput) FROM stdin;
\.


--
-- TOC entry 5037 (class 0 OID 24840)
-- Dependencies: 238
-- Data for Name: uni_categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uni_categorias (id, nome) FROM stdin;
\.


--
-- TOC entry 5038 (class 0 OID 24843)
-- Dependencies: 239
-- Data for Name: uni_clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uni_clientes (id, nome_completo, nome_social, data_nascimento, email, cpf, rg, telefone) FROM stdin;
\.


--
-- TOC entry 5039 (class 0 OID 24848)
-- Dependencies: 240
-- Data for Name: uni_enderecos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uni_enderecos (id, cep, logradouro, numero, estado, cidade, bairro, referencia, id_usuario) FROM stdin;
\.


--
-- TOC entry 5040 (class 0 OID 24857)
-- Dependencies: 242
-- Data for Name: uni_login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uni_login (login, senha) FROM stdin;
admin	$2a$10$B9H0wkJUvs1RDxO1J8JQd.haBAesRyRIXtZUMFyZB2lUSDQ54N02e
joao	$2a$10$uX0cs.Dgo/v4piaQbTYw0eKE4B2a2Se2ZYlwRBSy1L9/5tH08D14.
teste	$2a$10$SAj8BsAX5B9eXAdQgnAefuR3i/h4c3NDqDKeGPHJT0VEX9Y5jZjGW
\.


--
-- TOC entry 5041 (class 0 OID 24860)
-- Dependencies: 243
-- Data for Name: uni_lojas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uni_lojas (id, nome) FROM stdin;
\.


--
-- TOC entry 5042 (class 0 OID 24863)
-- Dependencies: 244
-- Data for Name: uni_produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uni_produtos (id, nome_produto, descricao_produto, valor_produto) FROM stdin;
\.


--
-- TOC entry 5043 (class 0 OID 24868)
-- Dependencies: 245
-- Data for Name: uni_ticket; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uni_ticket (id, id_pedido, assunto, descricao, categoria) FROM stdin;
\.


--
-- TOC entry 4885 (class 2606 OID 24874)
-- Name: uni_categorias uni_categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uni_categorias
    ADD CONSTRAINT uni_categorias_pkey PRIMARY KEY (id);


--
-- TOC entry 4890 (class 2606 OID 24876)
-- Name: uni_lojas uni_lojas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uni_lojas
    ADD CONSTRAINT uni_lojas_pkey PRIMARY KEY (id);


--
-- TOC entry 4886 (class 1259 OID 24877)
-- Name: idx_cpf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cpf ON public.uni_clientes USING btree (cpf);


--
-- TOC entry 4887 (class 1259 OID 24878)
-- Name: idx_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email ON public.uni_clientes USING btree (email);


--
-- TOC entry 4888 (class 1259 OID 24879)
-- Name: idx_nome_data; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nome_data ON public.uni_clientes USING btree (nome_completo, data_nascimento);


-- Completed on 2025-05-18 22:17:25

--
-- PostgreSQL database dump complete
--

