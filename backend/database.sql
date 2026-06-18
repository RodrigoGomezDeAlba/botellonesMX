CREATE DATABASE IF NOT EXISTS botellonesmx
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE botellonesmx;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  phone VARCHAR(30),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  category_id INT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_categories
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  shipping_address VARCHAR(255) NOT NULL,
  payment_method VARCHAR(80) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_users
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_orders
    FOREIGN KEY (order_id) REFERENCES orders(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order_items_products
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL
);

INSERT INTO categories (id, name, description) VALUES
  (1, 'Termicas', 'Botellas termicas para conservar temperatura'),
  (2, 'Deportivas', 'Botellas ligeras para entrenamiento'),
  (3, 'Vidrio', 'Botellas reutilizables de vidrio'),
  (4, 'Infantiles', 'Botellas para ninos y escuela')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO users (id, name, email, password, role, phone, address) VALUES
  (1, 'Administrador BotellonesMX', 'admin@botellonesmx.com', '$2b$10$.YwQjUQpW8m9JVYbi3B8e.qjZJ25j0dYGY/ZZrkrJsc368jhjoiEm', 'admin', '4491000000', 'Aguascalientes, Ags.'),
  (2, 'Usuario Demo Uno', 'usuario1@botellonesmx.com', '$2b$10$ZXsHBbmFR4RhElhY.FKbdO87HJcuYGd85K2/J2zn4vCrfjSv7TXae', 'user', '4491000001', 'Av. Universidad 101'),
  (3, 'Usuario Demo Dos', 'usuario2@botellonesmx.com', '$2b$10$64mr1xQWqkGc3gkI95b1e.gtxTUZPans/U9DyLB39EI6nh4bD4RNm', 'user', '4491000002', 'Centro, Aguascalientes')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password = VALUES(password),
  role = VALUES(role),
  phone = VALUES(phone),
  address = VALUES(address);

INSERT INTO products (id, name, description, price, stock, image_url, category_id, is_active) VALUES
  (1, 'Botella Termica Acero 750 ml', 'Botella de acero inoxidable con doble pared para bebidas frias o calientes.', 329.00, 25, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80', 1, 1),
  (2, 'Botella Deportiva Tritan 1 L', 'Botella resistente, ligera y libre de BPA para gimnasio o actividades al aire libre.', 189.00, 40, 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=900&q=80', 2, 1),
  (3, 'Botella de Vidrio Eco 600 ml', 'Diseno reutilizable con funda protectora para uso diario.', 219.00, 18, 'https://images.unsplash.com/photo-1610824352934-c10d87b700cc?auto=format&fit=crop&w=900&q=80', 3, 1),
  (4, 'Botella Infantil Antiderrames 500 ml', 'Botella colorida con tapa segura para escuela y paseos.', 159.00, 32, 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?auto=format&fit=crop&w=900&q=80', 4, 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  stock = VALUES(stock),
  image_url = VALUES(image_url),
  category_id = VALUES(category_id),
  is_active = VALUES(is_active);
