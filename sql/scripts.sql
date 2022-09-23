CREATE SEQUENCE IF NOT EXISTS provision_req_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE TABLE IF NOT EXISTS provision_req_t
(
    id bigint NOT NULL DEFAULT nextval('provision_req_id_seq'::regclass),
    email_address text COLLATE pg_catalog."default" NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    company_info text COLLATE pg_catalog."default",
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    additional_contacts text COLLATE pg_catalog."default",
    country text COLLATE pg_catalog."default",
    request_processing_status text COLLATE pg_catalog."default",
    sandbox_details text COLLATE pg_catalog."default",
    sandbox_id text COLLATE pg_catalog."default",
    CONSTRAINT provision_req_t_pkey PRIMARY KEY (id),
    CONSTRAINT provision_req_t_id_key UNIQUE (id)
)

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX provision_req_t_pkey ON provision_req_t(id int8_ops);
CREATE UNIQUE INDEX provision_req_t_id_key ON provision_req_t(id int8_ops);