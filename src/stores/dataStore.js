import { defineStore } from 'pinia';
import { ref } from 'vue';































































































































export const useDataStore = defineStore('data', () => {
  // Local storage helper
  function loadFromStorage(key, defaultValue) {
    const stored = localStorage.getItem(`hospital_dietary_${key}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Failed to parse stored ${key}`, e);
      }
    }
    return defaultValue;
  }

  function saveToStorage(key, value) {
    localStorage.setItem(`hospital_dietary_${key}`, JSON.stringify(value));
  }

  const defaultPatients = [
  {
    id: "P001",
    name: "Juan Dela Cruz",
    age: 62,
    gender: "Male",
    room: "101-A",
    admissionDate: "2026-05-20T08:00:00",
    condition: "Diabetes Mellitus Type 2",
    physician: "Dr. Santos",
    height: 168,
    weight: 82,
    bloodType: "O+",
    status: "Active",
    dob: "",
    contactNumber: "",
    address: "",
    allergies: "Tuyo",
    admissionType: "",
    emergencyContactName: "",
    emergencyContactRel: "",
    emergencyContactNumber: ""
  },
  {
    id: "P002",
    name: "Maria Santos",
    age: 55,
    gender: "Female",
    room: "102-B",
    admissionDate: "2026-05-21T09:30:00",
    condition: "Hypertension",
    physician: "Dr. Santos",
    height: 155,
    weight: 68,
    bloodType: "A+",
    status: "Active"
  },
  {
    id: "P003",
    name: "Rosa Reyes",
    age: 45,
    gender: "Female",
    room: "103-A",
    admissionDate: "2026-05-22T10:00:00",
    condition: "Chronic Kidney Disease Stage 3",
    physician: "Dr. Santos",
    height: 158,
    weight: 60,
    bloodType: "B+",
    status: "Active"
  },
  {
    id: "P004",
    name: "Pedro Bautista",
    age: 38,
    gender: "Male",
    room: "104-C",
    admissionDate: "2026-05-23T07:45:00",
    condition: "Gastroenteritis",
    physician: "Dr. Santos",
    height: 172,
    weight: 70,
    bloodType: "AB+",
    status: "Active"
  },
  {
    id: "P005",
    name: "Lorna Garcia",
    age: 71,
    gender: "Female",
    room: "105-B",
    admissionDate: "2026-05-24T11:00:00",
    condition: "Congestive Heart Failure",
    physician: "Dr. Santos",
    height: 150,
    weight: 72,
    bloodType: "O-",
    status: "Active"
  }];


  const defaultPrescriptions = [
  {
    id: "RX001",
    patientId: "P001",
    patientName: "Juan Dela Cruz",
    doctorId: "DOC001",
    doctorName: "Dr. Santos",
    dietType: "DM (Diabetic Mellitus) Diet",
    allergies: ["Shellfish"],
    restrictions: ["Low Sugar", "No Fried Foods", "No Sweets"],
    feedingInstructions: "Small frequent meals every 4 hours. Monitor blood glucose before and after meals.",
    medicalOrders: "Restrict carbohydrates to 45-60g per meal. Avoid simple sugars and processed foods.",
    createdAt: "2026-05-20T09:00:00",
    updatedAt: "2026-05-20T09:00:00",
    status: "Active"
  },
  {
    id: "RX002",
    patientId: "P002",
    patientName: "Maria Santos",
    doctorId: "DOC001",
    doctorName: "Dr. Santos",
    dietType: "Low Salt/Low Fat",
    allergies: ["Dairy"],
    restrictions: ["Low Salt", "Low Fat", "No Processed Foods"],
    feedingInstructions: "No added salt in meals. Limit sodium intake to 2000mg per day.",
    medicalOrders: "Monitor blood pressure daily. Encourage fluid intake of at least 8 glasses per day.",
    createdAt: "2026-05-21T10:00:00",
    updatedAt: "2026-05-21T10:00:00",
    status: "Active"
  },
  {
    id: "RX003",
    patientId: "P003",
    patientName: "Rosa Reyes",
    doctorId: "DOC001",
    doctorName: "Dr. Santos",
    dietType: "High Protein Diet",
    allergies: ["Nuts", "Soy"],
    restrictions: ["Low Phosphorus", "Low Potassium", "Fluid Restriction"],
    feedingInstructions: "Limit fluid intake to 1.5 liters per day. Avoid high-potassium foods.",
    medicalOrders: "Renal diet strictly required. Monitor BUN and creatinine levels weekly.",
    createdAt: "2026-05-22T11:00:00",
    updatedAt: "2026-05-22T11:00:00",
    status: "Active"
  },
  {
    id: "RX004",
    patientId: "P004",
    patientName: "Pedro Bautista",
    doctorId: "DOC001",
    doctorName: "Dr. Santos",
    dietType: "Soft Diet (Mechanical Soft Diet)",
    allergies: [],
    restrictions: ["Soft Foods Only", "No Spicy Foods", "No Raw Foods"],
    feedingInstructions: "Soft, easily digestible meals only. No solid or hard-to-digest foods.",
    medicalOrders: "Progress to regular diet as tolerated. Monitor for signs of GI distress.",
    createdAt: "2026-05-23T08:30:00",
    updatedAt: "2026-05-23T08:30:00",
    status: "Active"
  },
  {
    id: "RX005",
    patientId: "P005",
    patientName: "Lorna Garcia",
    doctorId: "DOC001",
    doctorName: "Dr. Santos",
    dietType: "Low Salt/Low Fat",
    allergies: ["Gluten", "Eggs"],
    restrictions: ["Low Sodium", "Low Fat", "Fluid Restriction 1.5L/day"],
    feedingInstructions: "Strictly low sodium. Limit fluid to 1.5L/day. Avoid fatty and salty foods.",
    medicalOrders: "Daily weight monitoring. Report any sudden weight gain of more than 1kg.",
    createdAt: "2026-05-24T12:00:00",
    updatedAt: "2026-05-24T12:00:00",
    status: "Active"
  }];


  const defaultMealAssignments = [
  {
    id: "MA001",
    patientId: "P001",
    patientName: "Juan Dela Cruz",
    date: "2026-05-25",
    breakfastCarb: "Oatmeal",
    breakfastProtein: "Boiled Egg",
    breakfastSide: "Banana",
    lunchCarb: "White Rice",
    lunchProtein: "Grilled Chicken",
    lunchSide: "Papaya",
    dinnerCarb: "Lugaw",
    dinnerProtein: "Chicken Tinola",
    dinnerSide: "Apple",
    breakfastCost: 15,
    lunchCost: 45,
    dinnerCost: 55,
    totalCost: 145,
    assignedBy: "Rita Cruz, RND",
    assignedAt: "2026-05-25T07:00:00",
    feedingInstructions: "Small frequent meals every 4 hours."
  },
  {
    id: "MA002",
    patientId: "P002",
    patientName: "Maria Santos",
    date: "2026-05-25",
    breakfast: "Rice Porridge (Lugaw)",
    lunch: "Fish Fillet with Vegetables",
    dinner: "Vegetable Soup with Bread",
    breakfastCost: 30,
    lunchCost: 60,
    dinnerCost: 40,
    totalCost: 130,
    assignedBy: "Rita Cruz, RND",
    assignedAt: "2026-05-25T07:05:00",
    feedingInstructions: "No added salt in meals."
  },
  {
    id: "MA003",
    patientId: "P004",
    patientName: "Pedro Bautista",
    date: "2026-02-05",
    breakfast: "Plain Macaroni Soup (Sopas)",
    lunch: "Boiled Chicken Breast & Mashed Potato",
    dinner: "Clear Chicken Broth",
    breakfastCost: 40,
    lunchCost: 65,
    dinnerCost: 25,
    totalCost: 130,
    assignedBy: "Ana Reyes",
    assignedAt: "2026-05-26T15:36:19.659Z"
  },
  {
    id: "MA004",
    patientId: "P003",
    patientName: "Rosa Reyes",
    date: "2026-05-28",
    breakfastCarb: "Lugaw",
    breakfastProtein: "Hard Boiled Egg",
    breakfastSide: "",
    lunchCarb: "Rice",
    lunchProtein: "Steamed Beef",
    lunchSide: "Steamed Carrots",
    dinnerCarb: "Rice",
    dinnerProtein: "Chicken Adobo",
    dinnerSide: "",
    breakfastCost: 10,
    lunchCost: 25,
    dinnerCost: 30,
    totalCost: 65,
    assignedBy: "Ana Reyes",
    assignedAt: "2026-05-28T02:49:42.926Z",
    feedingInstructions: "Limit fluid intake to 1.5 liters per day. Avoid high-potassium foods."
  }];


  const patients = ref(loadFromStorage('patients', defaultPatients));

  const prescriptions = ref(loadFromStorage('prescriptions', defaultPrescriptions));

  const mealAssignments = ref(loadFromStorage('mealAssignments', defaultMealAssignments));

  const dishes = ref(loadFromStorage('dishes', [
  { 
    id: 'D001', name: 'Champorado with Tuyo', mealType: 'Breakfast', componentType: 'Carbohydrate-Controlled Diet', dietCategories: ['Normal Diet (Regular Diet)', 'Carbohydrate-Controlled Diet'], 
    cost: 45, calories: 350, protein: 12, carbs: 65, fat: 8, sodium: 420, description: 'Sweet chocolate rice porridge paired with salted dried fish', allergens: ['Fish', 'Dairy', 'Gluten'],
    ingredients: [{ name: 'Rice', qty: 0.1, unit: 'kg' }, { name: 'Milk', qty: 0.05, unit: 'liters' }]
  },
  { 
    id: 'D002', name: 'Soft Boiled Egg', mealType: 'Breakfast', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'High Protein Diet', 'Bland Diet'], 
    cost: 15, calories: 150, protein: 12, carbs: 0, fat: 10, sodium: 120, description: 'Two soft boiled eggs', allergens: ['Eggs'],
    ingredients: [{ name: 'Eggs', qty: 0.06, unit: 'trays' }] 
  },
  { 
    id: 'D003', name: 'Plain Macaroni Soup (Sopas)', mealType: 'Breakfast', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Full Liquid Diet'], 
    cost: 40, calories: 280, protein: 10, carbs: 35, fat: 8, sodium: 380, description: 'Warm, creamy macaroni soup with tiny vegetable bits', allergens: ['Gluten', 'Dairy'],
    ingredients: [{ name: 'Milk', qty: 0.1, unit: 'liters' }, { name: 'Vegetables', qty: 0.05, unit: 'kg' }]
  },
  { id: 'D004', name: 'Fresh Fruit Platter', mealType: 'Breakfast', componentType: 'Side/Fruit', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Low Salt/Low Fat', 'DM (Diabetic Mellitus) Diet', 'High Fiber Diet'], cost: 50, calories: 120, protein: 2, carbs: 28, fat: 0, sodium: 5, description: 'Sliced ripe papaya, banana, and melon', allergens: [] },
  { id: 'D005', name: 'Baked Salmon with Broccoli', mealType: 'Lunch', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'Low Salt/Low Fat', 'DM (Diabetic Mellitus) Diet', 'High Protein Diet'], cost: 110, calories: 420, protein: 35, carbs: 12, fat: 18, sodium: 150, description: 'Oven-baked salmon fillet served with steamed broccoli florets', allergens: ['Fish'] },
  { 
    id: 'D006', name: 'Boiled Chicken Breast', mealType: 'Lunch', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Bland Diet', 'Low Salt/Low Fat', 'Low Purine'], 
    cost: 45, calories: 160, protein: 28, carbs: 0, fat: 5, sodium: 110, description: 'Tender boiled chicken breast', allergens: [],
    ingredients: [{ name: 'Chicken', qty: 0.15, unit: 'kg' }] 
  },
  { 
    id: 'D007', name: 'Shrimp Sinigang', mealType: 'Lunch', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'High Protein Diet'], 
    cost: 85, calories: 280, protein: 22, carbs: 15, fat: 4, sodium: 520, description: 'Sour tamarind soup with fresh shrimp and vegetables', allergens: ['Shellfish'],
    ingredients: [{ name: 'Vegetables', qty: 0.1, unit: 'kg' }] 
  },
  { 
    id: 'D008', name: 'Pinakbet (Mixed Vegetables)', mealType: 'Lunch', componentType: 'Side/Fruit', dietCategories: ['Normal Diet (Regular Diet)', 'High Fiber Diet', 'DM (Diabetic Mellitus) Diet'], 
    cost: 55, calories: 180, protein: 8, carbs: 22, fat: 6, sodium: 410, description: 'Local vegetables sauteed in shrimp paste (bagoong)', allergens: ['Fish'],
    ingredients: [{ name: 'Vegetables', qty: 0.15, unit: 'kg' }] 
  },
  { 
    id: 'D009', name: 'Chicken Tinola', mealType: 'Dinner', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'DM (Diabetic Mellitus) Diet', 'Low Purine', 'High Protein Diet'], 
    cost: 50, calories: 200, protein: 18, carbs: 15, fat: 10, sodium: 280, description: 'Chicken soup with green papaya and ginger', allergens: [],
    ingredients: [{ name: 'Chicken', qty: 0.15, unit: 'kg' }, { name: 'Vegetables', qty: 0.1, unit: 'kg' }] 
  },
  { id: 'D010', name: 'Beef Mami (Noodle Soup)', mealType: 'Dinner', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'Carbohydrate-Controlled Diet'], cost: 60, calories: 450, protein: 24, carbs: 55, fat: 14, sodium: 650, description: 'Hot noodle soup with tender beef brisket slices', allergens: ['Gluten', 'Eggs', 'Soy'] },
  { 
    id: 'D011', name: 'Clear Chicken Broth', mealType: 'Dinner', componentType: 'Protein/Viand', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Full Liquid Diet', 'Bland Diet', 'Low Purine'], 
    cost: 25, calories: 80, protein: 4, carbs: 2, fat: 2, sodium: 200, description: 'Strained, clear chicken soup for easy digestion', allergens: [],
    ingredients: [{ name: 'Chicken', qty: 0.05, unit: 'kg' }] 
  },
  { 
    id: 'D012', name: 'White Rice (1 Cup)', mealType: 'Lunch', componentType: 'Carbohydrate-Controlled Diet', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Low Salt/Low Fat', 'Low Purine'], 
    cost: 15, calories: 200, protein: 4, carbs: 45, fat: 0, sodium: 0, description: 'Steamed white rice', allergens: [],
    ingredients: [{ name: 'Rice', qty: 0.1, unit: 'kg' }] 
  },
  { 
    id: 'D013', name: 'Rice Porridge (Lugaw)', mealType: 'Breakfast', componentType: 'Carbohydrate-Controlled Diet', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Full Liquid Diet', 'Bland Diet', 'Low Purine', 'Low Salt/Low Fat'], 
    cost: 12, calories: 150, protein: 3, carbs: 32, fat: 0, sodium: 10, description: 'Warm rice porridge', allergens: [],
    ingredients: [{ name: 'Rice', qty: 0.05, unit: 'kg' }] 
  }]
  ));

  const menuCalendar = ref(loadFromStorage('menuCalendar', [
  { id: 'MC001', date: '2026-05-20', dishId: 'D001', dishName: 'Oatmeal with Fruits', mealType: 'Breakfast', dietCategories: ['DM (Diabetic Mellitus) Diet', 'Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Low Salt/Low Fat'], cost: 35, calories: 220 },
  { id: 'MC002', date: '2026-05-20', dishId: 'D005', dishName: 'Grilled Chicken with Rice', mealType: 'Lunch', dietCategories: ['Normal Diet (Regular Diet)', 'High Protein Diet', 'Low Purine'], cost: 55, calories: 450 },
  { id: 'MC003', date: '2026-05-20', dishId: 'D009', dishName: 'Chicken Tinola with Rice', mealType: 'Dinner', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'Low Purine'], cost: 50, calories: 400 },
  { id: 'MC004', date: '2026-05-21', dishId: 'D002', dishName: 'Scrambled Eggs with Toast', mealType: 'Breakfast', dietCategories: ['Normal Diet (Regular Diet)', 'Soft Diet (Mechanical Soft Diet)', 'High Protein Diet'], cost: 40, calories: 310 },
  { id: 'MC005', date: '2026-05-21', dishId: 'D006', dishName: 'Fish Fillet with Vegetables', mealType: 'Lunch', dietCategories: ['Normal Diet (Regular Diet)', 'Low Salt/Low Fat', 'DM (Diabetic Mellitus) Diet'], cost: 60, calories: 380 },
  { id: 'MC006', date: '2026-05-21', dishId: 'D010', dishName: 'Steamed Fish with Vegetables', mealType: 'Dinner', dietCategories: ['Normal Diet (Regular Diet)', 'Low Salt/Low Fat', 'Soft Diet (Mechanical Soft Diet)', 'DM (Diabetic Mellitus) Diet'], cost: 55, calories: 320 }]
  ));

  const notifications = ref(loadFromStorage('notifications', [
  {
    id: 'N001',
    recipientRole: 'Dietitian',
    message: 'New diet prescription for Juan Dela Cruz',
    type: 'info',
    read: false,
    createdAt: '2026-02-16T09:05:00',
    link: '/dietitian/prescriptions'
  }]
  ));

  const backflushHistory = ref(loadFromStorage('backflushHistory', []));

  const users = ref(loadFromStorage('users', [
  {
    id: 'U001',
    name: 'Dr. Santos',
    role: 'Doctor',
    email: 'doctor@hospital.com',
    status: 'Active'
  },
  {
    id: 'U002',
    name: 'Rita Cruz, RND',
    role: 'Dietitian',
    email: 'rita.cruz@moph.gov.ph',
    status: 'Active'
  },
  {
    id: 'U003',
    name: 'Mario Perez',
    role: 'Purchasing Officer',
    email: 'mario.perez@moph.gov.ph',
    status: 'Active'
  },
  {
    id: 'U004',
    name: 'Linda Santos',
    role: 'Kitchen Staff',
    email: 'linda.santos@moph.gov.ph',
    status: 'Active'
  },
  {
    id: 'U005',
    name: 'Tony Reyes',
    role: 'Food Server',
    email: 'tony.reyes@moph.gov.ph',
    status: 'Active'
  }]
  ));

  const activityLogs = ref(loadFromStorage('activityLogs', [
  { id: 'AL1', name: 'Carmen Lopez', action: 'Admitted to Room 202-B', type: 'admission', time: '2023-12-07T09:30:00' },
  { id: 'AL2', name: 'Pedro Reyes', action: 'Admitted to Room 201-C', type: 'admission', time: '2023-12-06T14:15:00' },
  { id: 'AL3', name: 'Rosa Mercado', action: 'Admitted to Room 105-A', type: 'admission', time: '2023-12-06T10:45:00' },
  { id: 'AL4', name: 'Angela Ramos', action: 'Discharged from Room 104-B', type: 'discharge', time: '2023-12-05T08:00:00' }]
  ));

  // Actions
  function addActivityLog(log) {
    activityLogs.value.unshift({
      id: `AL${Date.now()}`,
      ...log
    });
    saveToStorage('activityLogs', activityLogs.value);
  }

  async function addPatient(patient) {
    patients.value.push(patient);
    addActivityLog({
      name: patient.name,
      action: `Admitted to Room ${patient.room}`,
      type: 'admission',
      time: new Date().toISOString()
    });
    saveToStorage('patients', patients.value);
  }

  async function updatePatient(id, updates) {
    const index = patients.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      const oldPatient = patients.value[index];
      const newPatient = { ...oldPatient, ...updates };
      patients.value[index] = newPatient;

      saveToStorage('patients', patients.value);

      // Log status changes
      if (updates.status && updates.status !== oldPatient.status) {
        if (updates.status === 'Discharged') {
          addActivityLog({
            name: oldPatient.name,
            action: `Discharged from Room ${oldPatient.room}`,
            type: 'discharge',
            time: new Date().toISOString()
          });
        } else if (updates.status === 'Pending') {
          addActivityLog({
            name: oldPatient.name,
            action: `Marked as Pending Discharge`,
            type: 'update',
            time: new Date().toISOString()
          });
        }
      }
    }
  }

  async function addPrescription(prescription) {
    prescriptions.value.push(prescription);
    saveToStorage('prescriptions', prescriptions.value);

    // Create notification for dietitian
    notifications.value.push({
      id: `N${Date.now()}`,
      recipientRole: 'Dietitian',
      message: `New diet prescription for ${prescription.patientName}`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/dietitian/prescriptions'
    });
    saveToStorage('notifications', notifications.value);
  }

  async function addMealAssignment(assignment) {
    const index = mealAssignments.value.findIndex((m) => m.id === assignment.id);
    if (index !== -1) {
      mealAssignments.value[index] = assignment;
    } else {
      mealAssignments.value.push(assignment);
    }
    saveToStorage('mealAssignments', mealAssignments.value);
  }

  function markNotificationAsRead(id) {
    const notification = notifications.value.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      saveToStorage('notifications', notifications.value);
    }
  }

  function getUnreadNotificationsCount(role) {
    return notifications.value.filter((n) => n.recipientRole === role && !n.read).length;
  }

  function addBackflushHistory(history) {
    backflushHistory.value.unshift(history);
    saveToStorage('backflushHistory', backflushHistory.value);
  }

  function addUser(user) {
    users.value.push(user);
    saveToStorage('users', users.value);
  }

  function updateUser(id, updates) {
    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates };
      saveToStorage('users', users.value);
    }
  }

  function addMenuCalendarEntry(entry) {
    menuCalendar.value.push(entry);
    saveToStorage('menuCalendar', menuCalendar.value);
  }

  function deleteMenuCalendarEntry(id) {
    menuCalendar.value = menuCalendar.value.filter((e) => e.id !== id);
    saveToStorage('menuCalendar', menuCalendar.value);
  }

  function addDish(dish) {
    dishes.value.push(dish);
    saveToStorage('dishes', dishes.value);
  }

  function updateDish(id, updates) {
    const index = dishes.value.findIndex((d) => d.id === id);
    if (index !== -1) {
      dishes.value[index] = { ...dishes.value[index], ...updates };
      saveToStorage('dishes', dishes.value);
    }
  }

  function deleteDish(id) {
    dishes.value = dishes.value.filter((d) => d.id !== id);
    saveToStorage('dishes', dishes.value);
  }

  // --- INVENTORY STATE ---
  const defaultInventory = [
    { id: 'INV001', name: 'Rice', type: 'Non-Perishable', quantity: 15, unit: 'kg', location: 'Pantry', status: 'Low Stock', reorderLevel: 20, unitPrice: 50 },
    { id: 'INV002', name: 'Chicken', type: 'Perishable', quantity: 8, unit: 'kg', location: 'Refrigerator', status: 'Low Stock', reorderLevel: 10, unitPrice: 180 },
    { id: 'INV003', name: 'Vegetables', type: 'Perishable', quantity: 45, unit: 'kg', location: 'Refrigerator', status: 'In Stock', reorderLevel: 15, unitPrice: 60 },
    { id: 'INV004', name: 'Cooking Oil', type: 'Non-Perishable', quantity: 22, unit: 'liters', location: 'Pantry', status: 'In Stock', reorderLevel: 10, unitPrice: 120 },
    { id: 'INV005', name: 'Eggs', type: 'Perishable', quantity: 5, unit: 'trays', location: 'Refrigerator', status: 'Low Stock', reorderLevel: 8, unitPrice: 220 },
    { id: 'INV006', name: 'Butter', type: 'Perishable', quantity: 12, unit: 'kg', location: 'Refrigerator', status: 'In Stock', reorderLevel: 5, unitPrice: 300 },
    { id: 'INV007', name: 'Milk', type: 'Perishable', quantity: 15, unit: 'liters', location: 'Refrigerator', status: 'In Stock', reorderLevel: 8, unitPrice: 95 },
    { id: 'INV008', name: 'Potatoes', type: 'Perishable', quantity: 30, unit: 'kg', location: 'Pantry', status: 'In Stock', reorderLevel: 10, unitPrice: 75 }
  ];

  const defaultStockMovementLogs = [
    { id: 'SML001', timestamp: '2026-03-03T10:30:00', itemName: 'Rice', action: 'Stock In', quantity: 100, reference: 'PO-2026-001', performedBy: 'Mario Perez', unitPrice: 50, totalCost: 5000 },
    { id: 'SML002', timestamp: '2026-03-02T14:15:00', itemName: 'Chicken', action: 'Deduction', quantity: 5, reference: 'DIST-2026-045', performedBy: 'Linda Santos', unitPrice: 180, totalCost: 900 }
  ];

  const inventory = ref(loadFromStorage('inventory', defaultInventory));
  const stockMovementLogs = ref(loadFromStorage('stockMovementLogs', defaultStockMovementLogs));

  function addStockIn(item) {
    const qty = parseFloat(item.quantity);
    const addedCost = item.cost ? parseFloat(item.cost) : 0;
    const addedUnitPrice = addedCost > 0 && qty > 0 ? (addedCost / qty) : 0;
    
    let finalUnitPrice = addedUnitPrice;

    const existing = inventory.value.find(
      (i) => i.name.toLowerCase() === item.name.toLowerCase()
    );

    if (existing) {
      // Moving Average Unit Price Calculation
      const currentQty = existing.quantity || 0;
      const currentUnitPrice = existing.unitPrice || 0;
      
      if (currentQty + qty > 0) {
        finalUnitPrice = ((currentQty * currentUnitPrice) + addedCost) / (currentQty + qty);
      }
      
      existing.quantity += qty;
      existing.unitPrice = finalUnitPrice;
      existing.status = existing.quantity <= existing.reorderLevel ? 'Low Stock' : 'In Stock';
      if (item.unit) existing.unit = item.unit;
      if (item.location) existing.location = item.location;
      if (item.type) existing.type = item.type;
    } else {
      const newItem = {
        id: `INV${Date.now()}`,
        name: item.name,
        type: item.type || 'Perishable',
        quantity: qty,
        unitPrice: finalUnitPrice,
        unit: item.unit || 'kg',
        location: item.location || 'Pantry',
        reorderLevel: item.type === 'Perishable' ? 10 : 20,
        status: 'In Stock'
      };
      newItem.status = newItem.quantity <= newItem.reorderLevel ? 'Low Stock' : 'In Stock';
      inventory.value.push(newItem);
    }

    stockMovementLogs.value.unshift({
      id: `SML${Date.now()}`,
      timestamp: new Date().toISOString(),
      itemName: item.name,
      action: 'Stock In',
      quantity: qty,
      unitPrice: addedUnitPrice,
      totalCost: addedCost,
      reference: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      performedBy: 'Mario Perez'
    });

    saveToStorage('inventory', inventory.value);
    saveToStorage('stockMovementLogs', stockMovementLogs.value);
  }

  function deductStock(itemName, quantity) {
    const existing = inventory.value.find(
      (i) => i.name.toLowerCase() === itemName.toLowerCase()
    );
    
    let deductedValue = 0;
    let currentUnitPrice = 0;

    if (existing) {
      currentUnitPrice = existing.unitPrice || 0;
      const deductQty = parseFloat(quantity);
      
      existing.quantity = Math.max(0, existing.quantity - deductQty);
      existing.status = existing.quantity <= existing.reorderLevel ? 'Low Stock' : 'In Stock';
      if (existing.quantity === 0) {
        existing.status = 'Out of Stock';
      }
      
      deductedValue = deductQty * currentUnitPrice;
    }

    stockMovementLogs.value.unshift({
      id: `SML${Date.now()}`,
      timestamp: new Date().toISOString(),
      itemName: itemName,
      action: 'Deduction',
      quantity: parseFloat(quantity),
      unitPrice: currentUnitPrice,
      totalCost: deductedValue,
      reference: `DIST-2026-${Math.floor(100 + Math.random() * 900)}`,
      performedBy: 'Linda Santos'
    });

    saveToStorage('inventory', inventory.value);
    saveToStorage('stockMovementLogs', stockMovementLogs.value);
  }

  return {
    patients,
    dishes,
    prescriptions,
    mealAssignments,
    menuCalendar,
    notifications,
    backflushHistory,
    users,
    activityLogs,
    inventory,
    stockMovementLogs,
    addPatient,
    updatePatient,
    addDish,
    updateDish,
    deleteDish,
    addPrescription,
    addMealAssignment,
    addMenuCalendarEntry,
    deleteMenuCalendarEntry,
    markNotificationAsRead,
    getUnreadNotificationsCount,
    addBackflushHistory,
    addUser,
    updateUser,
    addActivityLog,
    addStockIn,
    deductStock
  };
});