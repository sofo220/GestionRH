CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id BIGINT NOT NULL REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS departments (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(40),
  address TEXT,
  position VARCHAR(120) NOT NULL,
  salary NUMERIC(12,2) NOT NULL,
  hire_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL,
  department_id BIGINT REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS leaves (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(80) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(30) NOT NULL,
  days INTEGER NOT NULL,
  employee_id BIGINT NOT NULL REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS payrolls (
  id BIGSERIAL PRIMARY KEY,
  base_salary NUMERIC(12,2) NOT NULL,
  bonuses NUMERIC(12,2) NOT NULL,
  deductions NUMERIC(12,2) NOT NULL,
  net_salary NUMERIC(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  employee_id BIGINT NOT NULL REFERENCES employees(id)
);

INSERT INTO roles(name) VALUES ('ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES ('RH') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES ('EMPLOYE') ON CONFLICT DO NOTHING;

INSERT INTO departments(name, description) VALUES
('Ressources Humaines', 'Gestion administrative et recrutement'),
('Informatique', 'Developpement et infrastructure'),
('Finance', 'Comptabilite et paie')
ON CONFLICT DO NOTHING;

-- Mot de passe: admin123
INSERT INTO users(name, email, password, role_id)
SELECT 'Administrateur', 'admin@gestionrh.com', '$2a$10$RhZ2Qd8nCeSV9XvUOaqHRe02x8gTRbrv6HL8sSmI2h5C7VgVgBIuO', r.id
FROM roles r WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO employees(first_name, last_name, email, phone, address, position, salary, hire_date, status, department_id)
SELECT 'Sara', 'El Amrani', 'sara@gestionrh.com', '0600000001', 'Casablanca', 'Responsable RH', 12000, '2023-01-10', 'ACTIF', d.id
FROM departments d WHERE d.name = 'Ressources Humaines'
ON CONFLICT DO NOTHING;

INSERT INTO employees(first_name, last_name, email, phone, address, position, salary, hire_date, status, department_id)
SELECT 'Yassine', 'Benali', 'yassine@gestionrh.com', '0600000002', 'Rabat', 'Developpeur Java', 15000, '2022-09-15', 'ACTIF', d.id
FROM departments d WHERE d.name = 'Informatique'
ON CONFLICT DO NOTHING;
