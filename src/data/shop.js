// src/data/shop.js
// In-memory data for pets
let pets = [
  { id: 1, name: 'Rex', type: 'dog', age: 2 },
  { id: 2, name: 'Mittens', type: 'cat', age: 3 }
];

function getAllPets() {
  return pets;
}

function getPetById(id) {
  return pets.find(pet => pet.id === id);
}

function addPet(pet) {
  pet.id = pets.length ? pets[pets.length - 1].id + 1 : 1;
  pets.push(pet);
  return pet;
}

function updatePet(id, newPet) {
  const idx = pets.findIndex(pet => pet.id === id);
  if (idx === -1) return null;
  pets[idx] = { ...pets[idx], ...newPet, id };
  return pets[idx];
}

function deletePet(id) {
  const idx = pets.findIndex(pet => pet.id === id);
  if (idx === -1) return false;
  pets.splice(idx, 1);
  return true;
}

module.exports = { getAllPets, getPetById, addPet, updatePet, deletePet };
