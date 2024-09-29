-- 1. Insert a new record into the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Test query for insertion
-- SELECT * FROM account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 2. Modify Tony Stark's account type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Test query for update
-- SELECT account_firstname, account_lastname, account_type FROM account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 3. Delete Tony Stark's record
DELETE FROM account
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Test query for deletion
-- SELECT * FROM account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- 4. Modify the description of the "GM Hummer"
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Test query for description update
-- SELECT inv_make, inv_model, inv_description FROM inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Inner join to select sport vehicles
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- 6. Update image and thumbnail paths
UPDATE inventory
SET 
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

-- Test query for image and thumbnail update
-- SELECT inv_make, inv_model, inv_image, inv_thumbnail 
-- FROM inventory 
-- WHERE inv_image LIKE '%/images/vehicles/%' 
-- LIMIT 5;