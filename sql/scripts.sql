CREATE TABLE provision_req_t (
    id bigint DEFAULT nextval('provision_req_id_seq'::regclass) PRIMARY KEY UNIQUE,
    email_address text NOT NULL,
    status text NOT NULL,
    company_info text,
    first_name text,
    last_name text,
    additional_contacts text,
    country text,
    request_processing_status text NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX provision_req_t_pkey ON provision_req_t(id int8_ops);
CREATE UNIQUE INDEX provision_req_t_id_key ON provision_req_t(id int8_ops);