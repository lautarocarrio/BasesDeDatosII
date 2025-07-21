## FUNDAMENTOS, INTEGRIDAD Y CONCURRENCIA
# Ejercicio 1: Reglas de identidad. 
### Dado un modelo de base de datos de una universidad, identificar violaciones posibles a la integridad referencial si se elimina un estudiante con cursos inscritos. ¿Qué mecanismos usarías para evitarlo?

ESTUDIANTE (id_estudiante, nombre, fecha_nacimiento, carrera, dni) <br>
INSCRIPCIONES (id_inscripcion, id_estudiante, id_curso)

Se podria violar la integridad si se elimina un ESTUDIANTE con cursos inscritos porque INSCRIPCIONES apunta a un id_estudiante que ya no existe.

Podriamos evitarlo usando Restricciones, por ejemplo:

    - ON DELETE RESTRICT: No permite eliminar estudiantes si tiene inscripciones asociadas.
    - ON DELETE CASCADE: Si se elimina un estudiante, tambien se elimina las inscripciones asociadas.
    - ON DELETE SET NULL: Si se elimina a un estudiante, INSCRIPCIONES id_estudiante queda en null.

<br/>
<br/>

# Ejercicio 2 Implementacion de restricciones:
### Crear una tabla Matriculas con restricciones de clave foránea. Luego, insertar datos que violen la integridad y mostrar el error generado.

## Creacion de las tablas

```sql
CREATE TABLE Estudiantes (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    fecha_ingreso DATE DEFAULT CURRENT_DATE
);

CREATE TABLE Cursos (
    codigo VARCHAR(10) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    creditos INTEGER NOT NULL CHECK (creditos > 0),
    departamento VARCHAR(50) NOT NULL
);

CREATE TABLE Matriculas (
    id INTEGER PRIMARY KEY,
    id_estudiante INTEGER NOT NULL,
    codigo_curso VARCHAR(10) NOT NULL,
    FOREIGN KEY (id_estudiante) REFERENCES Estudiantes(id),
    FOREIGN KEY (codigo_curso) REFERENCES Cursos(codigo)
);
```

## Poblacion con datos de prueba

```sql
INSERT INTO Estudiantes (id, nombre, email)
VALUES 
    (1, 'Ana Torres', 'ana.torres@example.com'),
    (2, 'Bruno Díaz', 'bruno.diaz@example.com'),
    (3, 'Carla Gómez', 'carla.gomez@example.com');

INSERT INTO Cursos (codigo, nombre, creditos, departamento)
VALUES 
    ('MAT101', 'Matemática I', 6, 'Ciencias Exactas'),
    ('INF202', 'Introducción a la Programación', 8, 'Informática'),
    ('HIS303', 'Historia Moderna', 4, 'Humanidades');

INSERT INTO Matriculas (id, id_estudiante, codigo_curso)
VALUES
    (1, 1, 'MAT101'),
    (2, 2, 'INF202'),
    (3, 3, 'HIS303');

```
## Violacion de integridad

### Integridad referencial
Matricula con estudiante inexistente
```sql
INSERT INTO Matriculas (id, id_estudiante, codigo_curso)
VALUES (10, 999, 'MAT101');

-- Error generado

-- Error Code: 1452. Cannot add or update a child row: a foreign key constraint fails (`universidad`.`matriculas`, CONSTRAINT `matriculas_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes` (`id`))
```
Matricula con curso inexistente
```sql
INSERT INTO Matriculas (id, id_estudiante, codigo_curso)
VALUES (11, 1, 'XYZ999');

-- Error generado

-- Error Code: 1452. Cannot add or update a child row: a foreign key constraint fails (`universidad`.`matriculas`, CONSTRAINT `matriculas_ibfk_2` FOREIGN KEY (`codigo_curso`) REFERENCES `cursos` (`codigo`))
```

### Integridad de unicidad
Dos estudiantes con el mismo email
```sql
INSERT INTO Estudiantes (id, nombre, email)
VALUES (4, 'Lucas Pérez', 'ana.torres@example.com');

-- Error generado

--Error Code: 1062. Duplicate entry 'ana.torres@example.com' for key 'estudiantes.email'
```

### Integridad de dominio
Curso con créditos negativos
```sql
INSERT INTO Cursos (codigo, nombre, creditos, departamento)
VALUES ('NEG001', 'Curso Fallido', -3, 'ErrorLand');

-- Error generado

-- Error Code: 3819. Check constraint 'cursos_chk_1' is violated.
```

### Restricciones NOT NULL
Campo obligatorio vacio
```sql
INSERT INTO Estudiantes (id, nombre)
VALUES (5, NULL);

--Error generado

--Error Code: 1048. Column 'nombre' cannot be null
```

### Clave Primaria
Dos estudiantes con el mismo id
```sql
INSERT INTO Estudiantes (id, nombre, email)
VALUES (1, 'Otro', 'otro@email.com');

--Error generado

--Error Code: 1062. Duplicate entry '1' for key 'estudiantes.PRIMARY'
```
<br/>
<br/>

# Ejercicio 3 Concurrencia:
### Simular una situaci´on donde dos usuarios intentan actualizar el mismo saldo de una cuenta bancaria. Analizar como afectan las condiciones de aislamiento (READ COMMITTED vs SERIALIZABLE).

## Tablas Iniciales
```sql
CREATE TABLE cuentas (
    cuenta_id INT PRIMARY KEY,
    saldo DECIMAL(10,2)
);

INSERT INTO cuentas (cuenta_id, saldo) VALUES (1, 1000.00);
```

## Caso de aislamiento READ COMMITTED

### Primer usuario 

```sql
BEGIN TRANSACTION;

SELECT saldo FROM cuentas WHERE cuenta_id = 1;
UPDATE cuentas SET saldo = 700 WHERE cuenta_id = 1;

COMMIT;
```
-   Usuario 1 inicia una transaccion.
-   Intenta leer el saldo actual el cual es 1000
-   Usuario 1 Calcula el nuevo saldo 1000 - 200 = 800 Por ejemplo
-   Usuario 1 Actualiza el saldo = 800
-   Usuario 1 Hace el commit

### Segundo usuario casi a la vez
```sql
BEGIN TRANSACTION;

SELECT saldo FROM cuentas WHERE cuenta_id = 1;
UPDATE cuentas SET saldo = 700 WHERE cuenta_id = 1;

COMMIT;
```
-   Usuario 2 inicia una transaccion
-   Intenta leer el saldo actual el cual sigue siendo 1000 porque el usuario 1 no hizo commit
-   Usuario 2 calcula el nuevo saldo 1000 - 400 = 600
-   Usuario 2 Actualiza el saldo = 600
-   Usuario 2 Hace el commit

### Resultado de las opreaciones
```sql
SELECT saldo FROM cuentas WHERE cuenta_id = 1;
```
-   Devuelve 500 y se pierde el retiro que hizo el Primer Usuario ya que el usuario 2 Sobreescribe sin saber del cambio hecho. Por la operacion casi en parealeo

## Caso de aislamiento SERIALIZABLE

### Primer usuario 

```sql

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;

SELECT saldo FROM cuentas WHERE cuenta_id = 1;
UPDATE cuentas SET saldo = 700 WHERE cuenta_id = 1;

COMMIT;

```
-   Usuario 1 inicia una transaccion esta vez con aislamiento serializable.
-   Intenta leer el saldo actual el cual es 1000
-   Usuario 1 Calcula el nuevo saldo 1000 - 200 = 800
-   Usuario 1 Actualiza el saldo = 800
-   Usuario 1 Hace el commit

### Segundo usuario 

```sql

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;

SELECT saldo FROM cuentas WHERE cuenta_id = 1;

UPDATE cuentas SET saldo = 700 WHERE cuenta_id = 1;

COMMIT;

```
-   Usuario 2 inicia una transaccion esta vez con aislamienot serializable.
-   Intenta leer el saldo actual pero queda bloqueado hasta que Usuario 1 haga el commit. Serializable no deja leer los datos no confirmados por seguridad
-   Luego que el Usuario 1 haga el commit Usuario 2 continua esta vez con el valor del saldo actualizado = 800
-   Usuario 2 Calcula el nuevo saldo 800 - 400 = 400
-   Usuario 2 Actualiza el saldo = 400
-   Usuario 2 Hace el commit

## Resultado de las operaciones
```sql
SELECT saldo FROM cuentas WHERE cuenta_id = 1;
```
-   Devuelve el verdadero saldo que es 400 producto de este nivel de aislamiento las transacciones se ejecutan en orden y no se pierden actualizaciones

## Optimizacion de Consultas, Indices y Vistas
# Ejercicio 4 Plan de ejecucion:
## CREACION Y NORMALIZACION DE LAS TABLAS 

```sql
-- CREACION DE LAS TABLAS
CREATE TABLE  marcas(
id int auto_increment primary key not null unique,
marca varchar(255) unique
);
CREATE TABLE  categorias(
id int auto_increment primary key not null unique,
categoria varchar(255) unique
);

-- MARCAS NORMALIZACION
SELECT DISTINCT marca FROM PRODUCTOS;

INSERT INTO marcas(marca) VALUES ('Oscorp'),('Acme'),('Soylent'),('Wonka'),('Wayne'),('Stark'),('Initech'),('Globex'),('Umbrella'),('Hooli');

select * from marcas;

ALTER TABLE productos ADD column marca_id INT;

UPDATE productos p 
JOIN marcas m ON p.marca = m.marca 
SET p.marca_id = m.id;

ALTER TABLE productos DROP column marca;

ALTER TABLE productos 
ADD CONSTRAINT fk_marca
FOREIGN KEY (marca_id) REFERENCES marcas(id);

-- CATEGORIA NORMALIZACION
SELECT DISTINCT categoria FROM PRODUCTOS;

INSERT INTO categorias(categoria) VALUES ('Electrónica'),('Juguetes'),('Mascotas'),('Ropa'),('Libros'),('Deportes'),('Belleza'),('Hogar');

select * from categorias;

ALTER TABLE productos ADD column categoria_id INT;

UPDATE productos p 
JOIN categorias c ON p.categoria = c.categoria 
SET p.categoria_id = c.id;

ALTER TABLE productos DROP column categoria;

ALTER TABLE productos
ADD CONSTRAINT fk_categoria
FOREIGN KEY (categoria_id) REFERENCES categorias(id);
```

## CONSULTA SIN INDICE
```sql
explain select * from productos where nombre = 'Find Mini'
```
|select_type | table     | type | key         | rows |filtered|id| Extra         |
|-------------|-----------|------|-------------|------|---|--|---------------|
| SIMPLE      | productos | ALL  | NULL        |99130|10.00| 1 | Using where   |

-   En este caso se escanea toda la tabla
-   Mysql revisa conicidencias de entre 99130 filas en busqueda de coincidencias
-   Al no utilizar ningun indice el rendimiento es bastante lento

## CONSULTA CON INDICE

```sql
CREATE INDEX idx_nombre ON productos(nombre);
```
| id | select_type | table     | partitions | type | possible_keys | key        | key_len | ref   | rows | filtered | Extra |
|----|-------------|-----------|------------|------|----------------|------------|---------|-------|------|----------|-------|
| 1  | SIMPLE      | productos | NULL       | ref  | idx_nombre     | idx_nombre | 403     | const | 10   | 100.00   | NULL  |

-   En este caso utiliza indices para buscar filas entonces es mas eficiente
-   Estima que se deben revisar 10 filas
-   El inidice va directamente hacia las coincidencias exactas

# Ejercicio 5 Creacion de Indices:

## CREACION Y POBLACION DE TABLAS 
```sql
CREATE TABLE IF NOT EXISTS Ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto VARCHAR(100),
    categoria VARCHAR(50),
    fecha DATE,
    cantidad INT,
    total DECIMAL(10, 2)
);

INSERT INTO Ventas (producto, categoria, fecha, cantidad, total) VALUES
('Notebook', 'Tecnología', '2024-01-15', 1, 1500.00),
('Celular', 'Tecnología', '2024-01-20', 2, 2000.00),
('Silla', 'Muebles', '2024-02-01', 4, 400.00),
('Escritorio', 'Muebles', '2024-02-10', 1, 800.00);
```

## Creacion de indices
```sql
SELECT * FROM Ventas
WHERE categoria = 'Tecnología' AND fecha >= '2024-01-01';

-- Crear índice individual por categoría
CREATE INDEX idx_categoria ON Ventas(categoria);

-- Crear índice compuesto por categoría y fecha
CREATE INDEX idx_categoria_fecha ON Ventas(categoria, fecha);

-- Ver plan de ejecución CON índice compuesto
EXPLAIN SELECT * FROM Ventas
WHERE categoria = 'Tecnología' AND fecha >= '2024-01-01';
```
-   Los indices compuestos, para consultas que tienen que filtrar varias columnas, tienen mejor rendimiento que los indices individuales.  


# Ejercicio 6
## Resumen de ventas mensuales por producto

```sql
CREATE VIEW ventas_mensuales_producto AS
SELECT 
    producto_id,
    YEAR(fecha_venta) AS año,
    MONTH(fecha_venta) AS mes,
    SUM(cantidad) AS unidades_vendidas,
FROM 
    ventas
GROUP BY 
    producto_id, 
    YEAR(fecha_venta), 
    MONTH(fecha_venta);
```
## Top 5 productos mas vendidos
```sql
SELECT 
    producto_id,
    SUM(unidades_vendidas) AS total_unidades
FROM 
    ventas_mensuales_producto
GROUP BY 
    producto_id
ORDER BY 
    total_unidades DESC
LIMIT 5;
```
## ADMINISTRACION SEGURIDAD Y MANTENIMIENTO
# Ejercicio 7: Gestion de Permisos
## Creacion del usuario
```sql
CREATE USER 'analista'@'localhost' IDENTIFIED BY 'analista123';
```
## Permisos

```sql
GRANT SELECT ON ecommerce.productos TO 'analista'@'localhost';
GRANT SELECT ON ecommerce.categorias TO 'analista'@'localhost';
GRANT SELECT ON ecommerce.marcas TO 'analista'@'localhost';
```
## Conectarse como analista
```sh
mysql -u analista -p
```
## Prueba de insert
```sql
INSERT INTO productos ( nombre, descripcion, precio, stock, categoria_id, marca_id)
VALUES ('Producto X', 'Prueba', 9999.99, 5, 1, 1);

-- Error Mostrado

--ERROR 1142 (42000): INSERT command denied to user 'analista'@'localhost' for table 'productos'
```
-    El user analista tiene solamente permisos de SELECT para esas tablas
# Ejercicio 9 Backup y restore:
## Backup
```sh
mysqldump -u [usuario] -p [nombre_base] > [archivo.sql]

mysqldump -u root -p ecommerce > ecommerce_backup.sql
```

## Restore
Si la base de datos no existe
```sh
mysql -u root -p -e "CREATE DATABASE ecommerce;"
```
Restaurar los datos
```sh
mysql -u root -p ecommerce < ecommerce_backup.sql
```