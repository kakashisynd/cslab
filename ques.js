// Array of objects containing questions and their corresponding source codes
const questions = [
	{
      question: "Aim: without ch",
      code: `
CREATE TABLE sales (
 item VARCHAR(50),
 location VARCHAR(50),
 time DATE,
 sales_amount DECIMAL(10, 2)
);
SELECT item, location, time, SUM(sales_amount) AS total_sales
FROM sales
GROUP BY CUBE(item, location, time);
#ROLLUP
SELECT item, SUM(total_sales) AS total_sales
FROM sales_cube
WHERE location IS NULL AND time IS NULL
GROUP BY item;
#Drilldown
SELECT item, location, SUM(total_sales) AS total_sales
FROM sales_cube
WHERE item = 'Laptop' AND time IS NULL
GROUP BY item, location;
#slice
SELECT item, location, total_sales
FROM sales_cube
WHERE time = '2024-06-01';
#dice
SELECT item, location, total_sales
FROM sales_cube
WHERE item IN ('Laptop', 'Phone') AND location IN ('Store1', 'Store2') AND time =
'2024-06-01';
#pivot
SELECT item, location,
 SUM(CASE WHEN time = '2024-06-01' THEN total_sales ELSE 0 END) AS
sales_june,
 SUM(CASE WHEN time = '2024-07-01' THEN total_sales ELSE 0 END) AS
sales_july
FROM sales_cube
GROUP BY item, location;

      `
    },
    {
      question: "Aim: With CH",
      code: `
  CREATE TABLE time (
 time_id INT PRIMARY KEY,
 day DATE,
 month VARCHAR(50),
 quarter VARCHAR(50),
 year INT
);
INSERT INTO time (time_id, day, month, quarter, year) VALUES
(1, '2024-06-01', 'June', 'Q2', 2024),
(2, '2024-06-02', 'June', 'Q2', 2024),
(3, '2024-06-15', 'June', 'Q2', 2024),
(4, '2024-07-01', 'July', 'Q3', 2024),
(5, '2024-07-02', 'July', 'Q3', 2024),
(6, '2024-07-03', 'July', 'Q3', 2024),
(7, '2024-08-01', 'August', 'Q3', 2024),
(8, '2024-08-15', 'August', 'Q3', 2024);
CREATE TABLE items (
 item_id INT PRIMARY KEY,
 item_name VARCHAR(50),
 brand VARCHAR(50),
 type VARCHAR(50)
);
INSERT INTO items (item_id, item_name, brand, type) VALUES
(1, 'Laptop', 'BrandA', 'Electronics'),
(2, 'Phone', 'BrandB', 'Electronics'),
(3, 'Tablet', 'BrandA', 'Electronics'),
(4, 'Headphones', 'BrandC', 'Accessories'),
(5, 'Smartwatch', 'BrandB', 'Accessories'),
(6, 'Monitor', 'BrandA', 'Electronics'),
(7, 'Keyboard', 'BrandD', 'Accessories'),
(8, 'Charger', 'BrandE', 'Accessories');
CREATE TABLE locations (
 location_id INT PRIMARY KEY,
 street VARCHAR(50),
 city VARCHAR(50),
 province_or_state VARCHAR(50),
 country VARCHAR(50)
);
INSERT INTO locations (location_id, street, city, province_or_state, country)
VALUES
(1, 'Street1', 'CityA', 'State1', 'Country1'),
(2, 'Street2', 'CityB', 'State1', 'Country1'),
(3, 'Street3', 'CityC', 'State2', 'Country1'),
(4, 'Street4', 'CityD', 'State2', 'Country1'),
(5, 'Street5', 'CityE', 'State3', 'Country1'),
(6, 'Street6', 'CityF', 'State3', 'Country1'),
(7, 'Street7', 'CityG', 'State4', 'Country1'),
(8, 'Street8', 'CityH', 'State4', 'Country1');
CREATE TABLE sales (
 sales_id INT PRIMARY KEY,
 item_id INT,
 location_id INT,
 time_id INT,
 sales_amount DECIMAL(10, 2),
 FOREIGN KEY (item_id) REFERENCES items(item_id),
 FOREIGN KEY (location_id) REFERENCES locations(location_id),
 FOREIGN KEY (time_id) REFERENCES time(time_id)
);
INSERT INTO sales (sales_id, item_id, location_id, time_id, sales_amount) VALUES
(1, 1, 1, 1, 1000.00),
(2, 2, 1, 1, 500.00),
(3, 1, 2, 2, 1500.00),
(4, 3, 1, 3, 750.00),
(5, 2, 2, 4, 300.00),
(6, 1, 3, 5, 2000.00),
(7, 3, 4, 6, 800.00),
(8, 5, 5, 7, 600.00);
CREATE MATERIALIZED VIEW sales_cube AS
SELECT t.day, t.month, t.quarter, t.year, i.item_name, i.brand,
i.type, l.street, l.city, l.province_or_state, l.country,
SUM(s.sales_amount) AS total_sales
FROM sales s
JOIN time t ON s.time_id = t.time_id
JOIN items i ON s.item_id = i.item_id
JOIN locations l ON s.location_id = l.location_id
GROUP BY CUBE(t.day, t.month, t.quarter, t.year,
 i.item_name, i.brand, i.type, l.street, l.city,
 l.province_or_state, l.country);
 #rollup
 SELECT i.type, SUM(s.total_sales) AS total_sales
FROM sales_cube s
JOIN items i ON s.item_name = i.item_name
GROUP BY i.type;
#drilldown
SELECT l.city, SUM(s.total_sales) AS total_sales
FROM sales_cube s
JOIN items i ON s.item_name = i.item_name
JOIN locations l ON s.street = l.street
WHERE i.type = 'Electronics'
GROUP BY l.city;
#slice
SELECT s.item_name, s.street, s.total_sales
FROM sales_cube s
WHERE s.day = '2024-06-01';
#dice
SELECT s.item_name, s.street, s.total_sales
FROM sales_cube s
WHERE s.item_name IN ('Laptop', 'Phone')
 AND s.city IN ('CityA', 'CityB')
 AND s.month = 'June';
 #pivot
 SELECT s.item_name,
 SUM(CASE WHEN s.day = '2024-06-01' THEN s.total_sales ELSE 0 END) AS "2024-06-01",
 SUM(CASE WHEN s.day = '2024-06-02' THEN s.total_sales ELSE 0 END) AS "2024-06-02",
 SUM(CASE WHEN s.day = '2024-06-15' THEN s.total_sales ELSE 0 END) AS "2024-06-15"
FROM sales_cube s
GROUP BY s.item_name;

      `
    },
    {
      question: "Aim: $ cubes",
      code: `
 CREATE TABLE items (
 item_id INT PRIMARY KEY,
 item_name VARCHAR(50),
 brand VARCHAR(50),
 type VARCHAR(50)
);
INSERT INTO items VALUES
(1, 'Laptop', 'BrandA', 'Electronics'),
(2, 'Phone', 'BrandB', 'Electronics'),
(3, 'Tablet', 'BrandA', 'Electronics');
-- Create time table
CREATE TABLE time (
 time_id INT PRIMARY KEY,
 day DATE,
 month VARCHAR(50),
 quarter VARCHAR(50),
 year INT
);
INSERT INTO time VALUES
(1, '2024-06-01', 'June', 'Q2', 2024),
(2, '2024-07-01', 'July', 'Q3', 2024),
(3, '2024-08-01', 'August', 'Q3', 2024),
(4, '2010-01-01', 'January', 'Q1', 2010),
(5, '2010-02-01', 'February', 'Q1', 2010);
-- Create locations table
CREATE TABLE locations (
 location_id INT PRIMARY KEY,
 street VARCHAR(50),
 city VARCHAR(50),
 province_or_state VARCHAR(50),
 country VARCHAR(50)
);
INSERT INTO locations VALUES
(1, 'Street1', 'CityA', 'State1', 'Country1'),
(2, 'Street2', 'CityB', 'State2', 'Country1'),
(3, 'Street3', 'CityC', 'State3', 'Country1'),
(4, 'Street4', 'CityD', 'State1', 'Country1'),
(5, 'Street5', 'CityE', 'State2', 'Country1');
-- Create sales table
CREATE TABLE sales (
 sales_id INT PRIMARY KEY,
 time_id INT,
 item_id INT,
 location_id INT,
 sales_amount DECIMAL(10, 2)
);
INSERT INTO sales VALUES
(1, 1, 1, 1, 1000.00),
(2, 2, 2, 2, 500.00),
(3, 3, 3, 3, 1500.00),
(4, 4, 1, 4, 2000.00),
(5, 5, 2, 5, 800.00);
#cuboid1
CREATE VIEW cuboid1 AS
SELECT
 t.year,
 i.item_name,
 l.city,
 SUM(s.sales_amount) AS total_sales
FROM sales s
JOIN time t ON s.time_id = t.time_id
JOIN items i ON s.item_id = i.item_id
JOIN locations l ON s.location_id = l.location_id
GROUP BY t.year, i.item_name, l.city;
#cuboid2
CREATE VIEW cuboid2 AS
SELECT
 t.year,
 i.brand,
 l.country,
 SUM(s.sales_amount) AS total_sales
FROM sales s
JOIN time t ON s.time_id = t.time_id
JOIN items i ON s.item_id = i.item_id
JOIN locations l ON s.location_id = l.location_id
GROUP BY t.year, i.brand, l.country;
#cuboid3
CREATE VIEW cuboid3 AS
SELECT
 t.year,
 i.brand,
 l.province_or_state,
 SUM(s.sales_amount) AS total_sales
FROM sales s
JOIN time t ON s.time_id = t.time_id
JOIN items i ON s.item_id = i.item_id
JOIN locations l ON s.location_id = l.location_id
GROUP BY t.year, i.brand, l.province_or_state;
#cuboid4
CREATE VIEW cuboid4 AS
SELECT
 i.item_name,
 l.province_or_state,
 SUM(s.sales_amount) AS total_sales
FROM sales s
JOIN time t ON s.time_id = t.time_id
JOIN items i ON s.item_id = i.item_id
JOIN locations l ON s.location_id = l.location_id
WHERE t.year = 2010
GROUP BY i.item_name, l.province_or_state;
#year = 2010
SELECT
 brand,
 province_or_state,
 SUM(total_sales) AS total_sales
FROM cuboid3
WHERE year = 2010
GROUP BY brand, province_or_state;
#for a specific year
SELECT
 item_name,
 city,
 SUM(total_sales) AS total_sales
FROM cuboid1
WHERE year = 2024
GROUP BY item_name, city;
#overallyears
SELECT
 brand,
 country,
 SUM(total_sales) AS total_sales
FROM cuboid2
GROUP BY brand, country;
#year2024
SELECT
 i.type AS item_type,
 l.province_or_state,
 SUM(s.sales_amount) AS total_sales
FROM sales s
JOIN time t ON s.time_id = t.time_id
JOIN items i ON s.item_id = i.item_id
JOIN locations l ON s.location_id = l.location_id
WHERE t.year = 2024
GROUP BY i.type, l.province_or_state;
      `
    },
    {
      question: "Aim: all python codes",
      code: `
 import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import scipy.stats as stats
from joypy import joyplot

# Sample data
categories = ['A', 'B', 'C', 'D']
values = [3, 7, 5, 9]

# Vertical Bar Plot
plt.figure(figsize=(10, 5))
plt.bar(categories, values)
plt.title('Vertical Bar Plot')
plt.xlabel('Categories')
plt.ylabel('Values')
plt.show()

# Horizontal Bar Plot
plt.figure(figsize=(10, 5))
plt.barh(categories, values)
plt.title('Horizontal Bar Plot')
plt.xlabel('Values')
plt.ylabel('Categories')
plt.show()

# Stacked Bar Plot (Vertical)
values2 = [2, 4, 3, 5]
plt.figure(figsize=(10, 5))
bar_width = 0.35
x = np.arange(len(categories))
plt.bar(x, values, width=bar_width, label='Group 1')
plt.bar(x, values2, width=bar_width, bottom=values, label='Group 2')
plt.title('Stacked Bar Plot (Vertical)')
plt.xlabel('Categories')
plt.ylabel('Values')
plt.xticks(x, categories)
plt.legend()
plt.show()

# Stacked Bar Plot (Horizontal)
plt.figure(figsize=(10, 5))
plt.barh(categories, values, label='Group 1')
plt.barh(categories, values2, left=values, label='Group 2')
plt.title('Stacked Bar Plot (Horizontal)')
plt.xlabel('Values')
plt.ylabel('Categories')
plt.legend()
plt.show()

# Grouped Bar Plot (Vertical)
x = np.arange(len(categories))
width = 0.35
fig, ax = plt.subplots(figsize=(10, 5))
ax.bar(x - width/2, values, width=width, label='Group 1')
ax.bar(x + width/2, values2, width=width, label='Group 2')
ax.set_title('Grouped Bar Plot (Vertical)')
ax.set_xlabel('Categories')
ax.set_ylabel('Values')
ax.set_xticks(x)
ax.set_xticklabels(categories)
ax.legend()
plt.show()

# Grouped Bar Plot (Horizontal)
fig, ax = plt.subplots(figsize=(10, 5))
ax.barh(x - width/2, values, width=width, label='Group 1')
ax.barh(x + width/2, values2, width=width, label='Group 2')
ax.set_title('Grouped Bar Plot (Horizontal)')
ax.set_xlabel('Values')
ax.set_ylabel('Categories')
ax.set_yticks(x)
ax.set_yticklabels(categories)
ax.legend()
plt.show()

# Histogram
data = np.random.normal(0, 1, size=1000)
plt.figure(figsize=(10, 5))
plt.hist(data, bins=30)
plt.title('Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.show()

# Overlapped Histogram
data2 = np.random.normal(1, 1.5, size=1000)
plt.figure(figsize=(10, 5))
plt.hist(data, bins=30, alpha=0.5)
plt.hist(data2, bins=30, alpha=0.5)
plt.title('Overlapped Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.show()

# Stacked Histogram (Vertical)
data3 = np.random.normal(-1.5, 1.0, size=1000)
n_bins = 30
counts1, bins1 = np.histogram(data3.flatten(), n_bins)
counts2, bins2 = np.histogram(data2.flatten(), n_bins)

fig = plt.figure(figsize=(10, 5))
widths = np.diff(bins1)

# Data3 Histogram
fig.add_subplot(111).bar(bins1[:-1], counts1 / counts1.sum(), width=widths,
                          align='edge', label='Data3', alpha=0.6)

# Data2 Histogram
fig.add_subplot(111).bar(bins2[:-1], counts2 / counts2.sum(), width=widths,
                          align='edge', label='Data2', alpha=0.6)

# Labels and Title for Stacked Histogram (Vertical)
plt.title("Stacked Histogram (Vertical)")
plt.xlabel("Value")
plt.ylabel("Density")
plt.legend()
plt.show()

# Stacked Histogram (Horizontal)
fig = plt.figure(figsize=(10, 5))

fig.add_subplot(111).barh(bins1[:-1], counts1 / counts1.sum(), height=widths,
                          align='edge', label='Data3', alpha=0.6)

fig.add_subplot(111).barh(bins2[:-1], counts2 / counts2.sum(), height=widths,
                          align='edge', label='Data2', alpha=0.6)

# Labels and Title for Stacked Histogram (Horizontal)
plt.title("Stacked Histogram (Horizontal)")
plt.xlabel("Density")
plt.ylabel("Value")
plt.legend()
plt.show()

# Dot Plot
sns.stripplot(data=[values], jitter=True)
plt.title("Dot Plot")
plt.xlabel("Categories")
plt.ylabel("Values")
plt.show()

# Heatmap
data_matrix = np.random.rand(10,12)
sns.heatmap(data_matrix)
plt.title("Heatmap")
plt.xlabel("Columns")
plt.ylabel("Rows")
plt.show()

# Density Plot
sns.kdeplot(data=data)
sns.kdeplot(data=data2)
plt.title("Density Plot")
plt.xlabel("Value")
plt.ylabel("Density")
plt.legend(['Data1', 'Data2'])
plt.show()

# Cumulative Distribution Function (CDF) - Separate Section
sns.ecdfplot(data=data)
sns.ecdfplot(data=data2)
pl.title("Cumulative Distribution Function")
pl.xlabel("Value")
pl.ylabel("Cumulative Probability")
pl.legend(['Data1', 'Data2'])
pl.show()

# Q-Q Plot - Separate Section
stats.probplot(data.flatten(), dist="norm", plot=pl)
stats.probplot(data2.flatten(), dist="norm", plot=pl)
pl.title("Q-Q Plot")
pl.xlabel("Theoretical Quantiles")
pl.ylabel("Sample Quantiles")
pl.show()

# Box Plot for Single Distribution
sns.boxplot(data=data)
pl.title("Box Plot - Single Distribution")
pl.xlabel("Distribution")
pl.ylabel("Values")
pl.show()

# Box Plot for Multiple Distributions
sns.boxplot(data=[data,data2,data3])
pl.title("Box Plot - Multiple Distributions")
pl.xlabel("Distributions")
pl.ylabel("Values")
pl.show()

# Scatterplot
x_data = np.random.rand(50)
y_data = np.random.rand(50)

pl.scatter(x_data,y_data)
pl.title("Scatterplot")
pl.xlabel("X-axis Values")
pl.ylabel("Y-axis Values")
pl.show()

# Scatter Plot Matrix
pd.plotting.scatter_matrix(pd.DataFrame({'x': x_data,'y': y_data}), figsize=(10,10), diagonal='kde')
pl.suptitle("Scatter Plot Matrix")
pl.xlabel("X-axis Values")
pl.ylabel("Y-axis Values")
pl.show()

# Joy Plot for Multiple Distributions using joypy library
data_list = [data.flatten(), data2.flatten(), data3.flatten()]
joyplot(data=data_list)

      `
    },
  
  ];
  
  // Function to generate question content with buttons to copy source code
  function generateQuestionContent() {
    const questionContainer = document.getElementById('questionContainer');
  
    questions.forEach((item, index) => {
      // Create question heading
      const questionHeading = document.createElement('h3');
      questionHeading.textContent = `Question ${index + 1}: ${item.question}`;
      questionContainer.appendChild(questionHeading);
  
      // Create code button
      const codeButton = document.createElement('button');
      codeButton.textContent = `Copy Source Code`;
      codeButton.addEventListener('click', () => {
        copyCode(item.code);
      });
      questionContainer.appendChild(codeButton);
      questionContainer.appendChild(document.createElement('br')); // Line break for spacing
    });
  }
  
  // Function to copy code to clipboard
  function copyCode(code) {
    navigator.clipboard.writeText(code)
      .then(() => {
      })
      .catch(err => {
        console.error('Unable to copy source code:', err);
      });
  }
  
  // Generate question content when the page loads
  document.addEventListener('DOMContentLoaded', generateQuestionContent);
  
