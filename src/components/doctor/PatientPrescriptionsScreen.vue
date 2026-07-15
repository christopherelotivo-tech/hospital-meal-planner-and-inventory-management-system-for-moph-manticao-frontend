<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4 mb-2">
      <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
        <Users :size="24" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Patient & Prescriptions</h1>
        <p class="text-sm text-gray-500">Clinical oversight and diet prescription management</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Users :size="20" class="text-blue-600" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-blue-600 leading-none mb-1">{{ totalPatients }}</h3>
          <p class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Patients</p>
        </div>
      </div>

      <div class="bg-[#f0fdf4] rounded-xl p-5 border border-[#dcfce7] shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <CheckCircle :size="20" class="text-green-600" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-green-700 leading-none mb-1">{{ prescribedCount }}</h3>
          <p class="text-xs font-semibold text-green-700 uppercase tracking-wide">With Prescriptions</p>
        </div>
      </div>

      <div class="bg-[#fffbeb] rounded-xl p-5 border border-[#fef3c7] shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
          <AlertCircle :size="20" class="text-yellow-600" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-yellow-700 leading-none mb-1">{{ pendingCount }}</h3>
          <p class="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Pending Prescription</p>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
              <th class="px-6 py-4">Patient Name</th>
              <th class="px-6 py-4">Age/Gender</th>
              <th class="px-6 py-4">Room & Bed</th>
              <th class="px-6 py-4">Diagnosis</th>
              <th class="px-6 py-4">Current Diet Prescription</th>
              <th class="px-6 py-4">Allergies</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="item in tableData" 
              :key="item.patient.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 align-top">
                <button 
                  @click="openPatientDetailsModal(item.patient)"
                  class="font-bold text-blue-600 hover:text-blue-800 hover:underline text-left focus:outline-none transition-colors"
                >
                  {{ item.patient.name }}
                </button>
                <div class="flex items-center text-[11px] text-gray-500 mt-1">
                  <Calendar :size="12" class="mr-1" />
                  Admitted: {{ formatDateTime(item.patient.admissionDate) }}
                </div>
              </td>
              
              <td class="px-6 py-4 align-top text-sm text-gray-700">
                {{ item.patient.age }} / {{ item.patient.gender }}
              </td>

              <td class="px-6 py-4 align-top">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6fcf5] text-[#00a67e] border border-[#a7f3d0]">
                  {{ formatRoom(item.patient.room) }}
                </span>
              </td>

              <td class="px-6 py-4 align-top text-sm text-gray-700">
                {{ item.patient.condition }}
              </td>

              <td class="px-6 py-4 align-top">
                <div v-if="item.prescription">
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <LinkIcon :size="12" class="mr-1" />
                    {{ item.prescription.dietType }}
                  </span>
                  <p class="text-[11px] text-gray-500 mt-1 max-w-[200px] truncate" :title="item.prescription.medicalOrders">
                    {{ item.prescription.medicalOrders }}
                  </p>
                </div>
                <div v-else>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#fffdf0] text-yellow-700 border border-yellow-200">
                    <AlertCircle :size="12" class="mr-1" />
                    Not Prescribed
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 align-top text-sm text-gray-700">
                {{ item.prescription?.allergies.join(', ') || 'None' }}
              </td>

              <td class="px-6 py-4 align-top">
                <div class="flex items-center justify-center space-x-2">
                  <button 
                    @click="openPrescriptionModal(item.patient, item.prescription)"
                    class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <FileText :size="14" class="mr-1.5" />
                    {{ item.prescription ? 'Update' : 'Prescribe' }}
                  </button>
                  <button 
                    @click="viewHistory(item.patient)"
                    class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Prescription History"
                  >
                    <History :size="14" />
                  </button>
                  <button 
                    @click="viewMealPlan(item.patient)"
                    class="w-7 h-7 rounded-lg bg-[#fef3c7] flex items-center justify-center text-yellow-700 hover:bg-yellow-200 transition-colors"
                    title="Assigned Meals Audit"
                  >
                    <Utensils :size="14" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="tableData.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                <Users :size="48" class="mx-auto mb-4 text-gray-300" />
                <p>No active patients found.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Prescription Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                {{ editingPrescription ? 'Update' : 'Create' }} Diet Prescription
              </h2>
              <p class="text-sm text-gray-500">For {{ selectedPatient?.name }} (Room {{ selectedPatient?.room }})</p>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X :size="24" />
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Diet Type Multi-Select Chips -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Dietary Prescriptions <span class="text-red-500">*</span>
                  <span class="text-xs text-gray-400 font-normal ml-1">(Select multiple)</span>
                </label>
                <div class="border-2 border-gray-200 rounded-lg p-3 focus-within:border-blue-600 transition-all">
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="diet in dietTypeOptions"
                      :key="diet"
                      type="button"
                      @click="toggleDietType(diet)"
                      class="px-3 py-1.5 rounded-full text-sm font-medium border transition-all"
                      :class="prescriptionForm.dietTypes.includes(diet)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'"
                    >
                      {{ diet }}
                    </button>
                  </div>
                </div>
                <p v-if="prescriptionForm.dietTypes.length === 0" class="text-xs text-red-500 mt-1">Please select at least one dietary prescription.</p>
              </div>

              <!-- Allergies -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Allergies
                </label>
                <select
                  v-model="allergyInput"
                  @change="addAllergy"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select an allergen to add</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Eggs">Eggs</option>
                  <option value="Fish">Fish</option>
                  <option value="Gluten">Gluten</option>
                  <option value="Peanuts">Peanuts</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Shellfish">Shellfish</option>
                  <option value="Soy">Soy</option>
                  <option value="Tree Nuts">Tree Nuts</option>
                  <option value="Wheat">Wheat</option>
                </select>
                <div v-if="prescriptionForm.allergies.length > 0" class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(allergy, index) in prescriptionForm.allergies"
                    :key="index"
                    class="inline-flex items-center space-x-1 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    <span>{{ allergy }}</span>
                    <button type="button" @click="removeAllergy(index)" class="hover:text-red-900">
                      <X :size="14" />
                    </button>
                  </span>
                </div>
              </div>

              <!-- Restrictions -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Dietary Restrictions
                </label>
                <input
                  v-model="restrictionInput"
                  type="text"
                  @keydown.enter.prevent="addRestriction"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Type and press Enter"
                />
                <div v-if="prescriptionForm.restrictions.length > 0" class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(restriction, index) in prescriptionForm.restrictions"
                    :key="index"
                    class="inline-flex items-center space-x-1 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    <span>{{ restriction }}</span>
                    <button type="button" @click="removeRestriction(index)" class="hover:text-yellow-900">
                      <X :size="14" />
                    </button>
                  </span>
                </div>
              </div>

              <!-- Medical Orders -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Medical Orders <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="prescriptionForm.medicalOrders"
                  required
                  rows="3"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Specific dietary requirements and restrictions"
                ></textarea>
              </div>

              <!-- Feeding Instructions -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Feeding Instructions <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="prescriptionForm.feedingInstructions"
                  required
                  rows="2"
                  class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Feeding schedule, portion sizes, special instructions"
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Save :size="18" />
                  <span>{{ editingPrescription ? 'Update' : 'Save' }} Prescription</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Patient Details Modal -->
    <transition name="fade">
      <div v-if="isPatientModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          <!-- Header -->
          <div class="px-6 md:px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <User :size="20" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ isEditingPatient ? 'Edit Patient Details' : 'Patient Information Card' }}
                </h2>
                <p class="text-xs text-gray-500 mt-0.5 font-semibold">ID: {{ selectedPatient?.id }}</p>
              </div>
            </div>
            <button @click="closePatientModal" class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
              <X :size="24" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 md:px-8 py-6 overflow-y-auto flex-1 bg-gray-50/30 space-y-6">
            <!-- Edit Mode -->
            <form v-if="isEditingPatient" @submit.prevent="savePatientDetails" class="space-y-6">
              <!-- Section: Personal Details -->
              <div>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Personal Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input
                      v-model="patientForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                    <input
                      v-model="patientForm.dob"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                    <input
                      v-model.number="patientForm.age"
                      type="number"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                    <select
                      v-model="patientForm.gender"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm bg-white transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                    <input
                      v-model="patientForm.contactNumber"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Complete Address</label>
                    <textarea
                      v-model="patientForm.address"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Section: Clinical & Medical Details -->
              <div>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Clinical & Medical Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Attending Physician</label>
                    <input
                      v-model="patientForm.physician"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Clinical Diagnosis</label>
                    <input
                      v-model="patientForm.condition"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Height (cm)</label>
                      <input
                        v-model.number="patientForm.height"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Weight (kg)</label>
                      <input
                        v-model.number="patientForm.weight"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Blood Type</label>
                      <select
                        v-model="patientForm.bloodType"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm bg-white transition-all"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Known Allergies</label>
                      <input
                        v-model="patientForm.allergies"
                        type="text"
                        placeholder="e.g. Peanuts, Seafood"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Section: Room & Admission details -->
              <div>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Room & Admission details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Room & Bed</label>
                    <input
                      v-model="patientForm.room"
                      type="text"
                      required
                      placeholder="e.g. 101-A"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Type</label>
                    <select
                      v-model="patientForm.admissionType"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm bg-white transition-all"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Outpatient">Outpatient</option>
                      <option value="ICU">ICU</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Status</label>
                    <select
                      v-model="patientForm.status"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm bg-white transition-all"
                    >
                      <option value="Active">Active (Admitted)</option>
                      <option value="Pending">Pending</option>
                      <option value="Discharged">Discharged</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Section: Emergency Contact Details -->
              <div>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                  Emergency Contact Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Name</label>
                    <input
                      v-model="patientForm.emergencyContactName"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Relationship</label>
                    <input
                      v-model="patientForm.emergencyContactRel"
                      type="text"
                      placeholder="e.g. Spouse, Parent"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                    <input
                      v-model="patientForm.emergencyContactNumber"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 shrink-0 bg-white">
                <button
                  type="button"
                  @click="isEditingPatient = false"
                  class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Save :size="16" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>

            <!-- View Mode -->
            <div v-else class="space-y-6">
              <!-- Personal Information Section -->
              <section>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Personal Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-sm">
                  <div class="sm:col-span-2">
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</span>
                    <p class="font-bold text-gray-800 mt-0.5">{{ selectedPatient?.name }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Date of Birth</span>
                    <p class="font-bold text-gray-800 mt-0.5">{{ selectedPatient?.dob || 'Not Provided' }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Age / Gender</span>
                    <p class="font-bold text-gray-800 mt-0.5">{{ selectedPatient?.age }} yrs / {{ selectedPatient?.gender }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Contact Number</span>
                    <p class="font-bold text-gray-800 mt-0.5">{{ selectedPatient?.contactNumber || 'Not Provided' }}</p>
                  </div>
                  <div class="sm:col-span-3 border-t border-gray-50 pt-2">
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Complete Address</span>
                    <p class="font-semibold text-gray-700 mt-0.5 leading-relaxed">{{ selectedPatient?.address || 'Not Provided' }}</p>
                  </div>
                </div>
              </section>

              <!-- Medical Information Section -->
              <section>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                  Medical Information
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-sm">
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Attending Physician</span>
                    <p class="font-bold text-gray-800 mt-0.5">{{ selectedPatient?.physician }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Clinical Diagnosis</span>
                    <p class="font-bold text-blue-700 mt-0.5">{{ selectedPatient?.condition }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-3 border-t border-gray-50 pt-2">
                    <div>
                      <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Height</span>
                      <p class="font-semibold text-gray-800 mt-0.5">{{ selectedPatient?.height ? selectedPatient.height + ' cm' : 'Not recorded' }}</p>
                    </div>
                    <div>
                      <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Weight</span>
                      <p class="font-semibold text-gray-800 mt-0.5">{{ selectedPatient?.weight ? selectedPatient.weight + ' kg' : 'Not recorded' }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3 border-t border-gray-50 pt-2">
                    <div>
                      <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Blood Type</span>
                      <p class="font-bold text-red-650 mt-0.5">{{ selectedPatient?.bloodType || 'N/A' }}</p>
                    </div>
                    <div>
                      <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Known Allergies</span>
                      <p class="font-bold text-gray-850 mt-0.5">{{ selectedPatient?.allergies || 'None' }}</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Room Information Section -->
              <section>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Room & Admission Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-sm">
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Date & Time Admitted</span>
                    <p class="font-semibold text-gray-800 mt-0.5">{{ selectedPatient ? formatDateTime(selectedPatient.admissionDate) : '' }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Room & Bed</span>
                    <p class="font-bold text-blue-700 mt-0.5">Room {{ selectedPatient?.room }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Admission Type & Status</span>
                    <p class="font-semibold mt-0.5">
                      {{ selectedPatient?.admissionType || 'Regular' }} ({{ selectedPatient?.status }})
                    </p>
                  </div>
                </div>
              </section>

              <!-- Emergency Contact Section -->
              <section>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                  Emergency Contact Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-sm">
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Contact Name</span>
                    <p class="font-bold text-gray-800 mt-0.5">{{ selectedPatient?.emergencyContactName || 'Not Provided' }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Relationship</span>
                    <p class="font-semibold text-gray-700 mt-0.5">{{ selectedPatient?.emergencyContactRel || 'N/A' }}</p>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Contact Number</span>
                    <p class="font-bold text-gray-800 mt-0.5">{{ selectedPatient?.emergencyContactNumber || 'N/A' }}</p>
                  </div>
                </div>
              </section>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-150 shrink-0 bg-white">
                <button
                  type="button"
                  @click="closePatientModal"
                  class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Close View
                </button>
                <button
                  type="button"
                  @click="isEditingPatient = true"
                  class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Pencil :size="16" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- History Modal -->
    <transition name="fade">
      <div v-if="isHistoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                <History :size="20" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Prescription History</h2>
                <p class="text-sm text-gray-500">{{ selectedPatient?.name }}</p>
              </div>
            </div>
            <button @click="closeHistoryModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X :size="24" />
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto bg-gray-50/50 flex-1">
            <div v-if="patientHistory.length === 0" class="text-center py-10">
              <FileText :size="48" class="mx-auto mb-3 text-gray-300" />
              <p class="text-gray-500 text-sm">No prescription history found for this patient.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="rx in patientHistory" 
                :key="rx.id"
                class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden"
              >
                <div class="absolute left-0 top-0 bottom-0 w-1" :class="rx.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'"></div>
                <div class="flex justify-between items-start mb-3 pl-2">
                  <div>
                    <h3 class="font-bold text-gray-900">{{ rx.dietType }}</h3>
                    <p class="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar :size="12" class="mr-1" />
                      {{ formatDateTime(rx.createdAt) }}
                    </p>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-md text-xs font-bold"
                    :class="rx.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ rx.status }}
                  </span>
                </div>
                
                <div class="space-y-2 text-sm pl-2">
                  <div v-if="rx.allergies.length > 0">
                    <span class="font-semibold text-gray-700">Allergies:</span>
                    <span class="text-gray-600 ml-1">{{ rx.allergies.join(', ') }}</span>
                  </div>
                  <div v-if="rx.restrictions.length > 0">
                    <span class="font-semibold text-gray-700">Restrictions:</span>
                    <span class="text-gray-600 ml-1">{{ rx.restrictions.join(', ') }}</span>
                  </div>
                  <div>
                    <span class="font-semibold text-gray-700">Medical Orders:</span>
                    <p class="text-gray-600 mt-0.5 bg-gray-50 p-2 rounded-lg border border-gray-100">{{ rx.medicalOrders }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Meal Plan Modal (Audit) -->
    <transition name="fade">
      <div v-if="isMealModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center text-yellow-700">
                <Utensils :size="20" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">Assigned Meals Audit</h2>
                <p class="text-sm text-gray-500">{{ selectedPatient?.name }}</p>
              </div>
            </div>
            <button @click="closeMealModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X :size="24" />
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto bg-gray-50/50 flex-1">
            <div v-if="patientMeals.length === 0" class="text-center py-10">
              <Utensils :size="48" class="mx-auto mb-3 text-gray-300" />
              <p class="text-gray-500 text-sm">No meals have been assigned to this patient yet.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="meal in patientMeals" 
                :key="meal.id"
                class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div class="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
                  <h3 class="font-bold text-gray-900 flex items-center">
                    <Calendar :size="14" class="mr-1.5 text-gray-400" />
                    {{ new Date(meal.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) }}
                  </h3>
                  <span class="text-xs text-gray-500">Assigned by {{ meal.assignedBy }}</span>
                </div>
                
                <div class="space-y-3">
                  <div class="flex items-start">
                    <div class="w-20 shrink-0 text-xs font-bold text-gray-500 uppercase mt-0.5">Breakfast</div>
                    <div class="text-sm text-gray-800 font-medium">{{ meal.breakfast || 'Not Assigned' }}</div>
                  </div>
                  <div class="flex items-start">
                    <div class="w-20 shrink-0 text-xs font-bold text-gray-500 uppercase mt-0.5">Lunch</div>
                    <div class="text-sm text-gray-800 font-medium">{{ meal.lunch || 'Not Assigned' }}</div>
                  </div>
                  <div class="flex items-start">
                    <div class="w-20 shrink-0 text-xs font-bold text-gray-500 uppercase mt-0.5">Dinner</div>
                    <div class="text-sm text-gray-800 font-medium">{{ meal.dinner || 'Not Assigned' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useAuthStore } from '@/stores/authStore';
import {
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Link as LinkIcon,
  FileText,
  History,
  Utensils,
  X,
  Save,
  Pencil,
  User } from
'lucide-vue-next';

const dataStore = useDataStore();
const authStore = useAuthStore();

// Modal States
const isModalOpen = ref(false);
const isHistoryModalOpen = ref(false);
const isMealModalOpen = ref(false);
const isPatientModalOpen = ref(false);
const isEditingPatient = ref(false);

const selectedPatient = ref(null);
const editingPrescription = ref(null);
const allergyInput = ref('');
const restrictionInput = ref('');

const patientForm = ref({
  name: '',
  age: 0,
  gender: 'Male',
  dob: '',
  contactNumber: '',
  address: '',
  room: '',
  condition: '',
  physician: '',
  height: undefined,
  weight: undefined,
  bloodType: '',
  allergies: '',
  admissionType: '',
  emergencyContactName: '',
  emergencyContactRel: '',
  emergencyContactNumber: '',
  status: 'Active'
});

const prescriptionForm = ref({
  dietType: '',
  dietTypes: [],
  allergies: [],
  restrictions: [],
  medicalOrders: '',
  feedingInstructions: ''
});

// Data Computation
const activePatients = computed(() => {
  const currentDoc = authStore.currentUser?.name || 'Dr. Santos';
  return dataStore.patients.filter((p) => p.status === 'Active' && p.physician === currentDoc);
});

const totalPatients = computed(() => activePatients.value.length);

const tableData = computed(() => {
  return activePatients.value.map((patient) => {
    const prescription = dataStore.prescriptions.find(
      (rx) => rx.patientId === patient.id && rx.status === 'Active'
    );
    return {
      patient,
      prescription
    };
  }).sort((a, b) => new Date(b.patient.admissionDate).getTime() - new Date(a.patient.admissionDate).getTime());
});

const prescribedCount = computed(() => tableData.value.filter((item) => item.prescription).length);
const pendingCount = computed(() => tableData.value.filter((item) => !item.prescription).length);

const patientHistory = computed(() => {
  if (!selectedPatient.value) return [];
  return dataStore.prescriptions.
  filter((p) => p.patientId === selectedPatient.value?.id).
  sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const patientMeals = computed(() => {
  if (!selectedPatient.value) return [];
  return dataStore.mealAssignments.
  filter((m) => m.patientId === selectedPatient.value?.id).
  sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// Formatting
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatRoom(roomString) {
  const parts = roomString.split('-');
  if (parts.length === 2) {
    return `Room ${parts[0]} • Bed ${parts[1]}`;
  }
  return `Room ${roomString}`;
}

// Diet Type Options
const dietTypeOptions = [
  'Normal Diet (Regular Diet)',
  'Light Diet',
  'Clear Liquid Diet',
  'Full Liquid Diet',
  'Pureed Diet',
  'Soft Diet (Mechanical Soft Diet)',
  'Bland Diet',
  'DM (Diabetic Mellitus) Diet',
  'Renal Diet',
  'Low Salt/Low Fat',
  'Low Purine',
  'Carbohydrate-Controlled Diet',
  'High Protein Diet',
  'High Fiber Diet'
];


function toggleDietType(diet) {
  const idx = prescriptionForm.value.dietTypes.indexOf(diet);
  if (idx === -1) {
    prescriptionForm.value.dietTypes.push(diet);
  } else {
    prescriptionForm.value.dietTypes.splice(idx, 1);
  }
  // Keep dietType in sync as a joined string for backward compatibility
  prescriptionForm.value.dietType = prescriptionForm.value.dietTypes.join(', ');
}

// Prescription Modal Logic
function openPrescriptionModal(patient, prescription) {
  selectedPatient.value = patient;

  if (prescription) {
    editingPrescription.value = prescription;
    const existingDietTypes = prescription.dietType ?
    prescription.dietType.split(', ').filter((d) => dietTypeOptions.includes(d)) :
    [];
    prescriptionForm.value = {
      dietType: prescription.dietType,
      dietTypes: existingDietTypes,
      allergies: [...prescription.allergies],
      restrictions: [...prescription.restrictions],
      medicalOrders: prescription.medicalOrders,
      feedingInstructions: prescription.feedingInstructions
    };
  } else {
    editingPrescription.value = null;
    resetForm();
  }

  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {
    if (!isHistoryModalOpen.value && !isMealModalOpen.value) {
      selectedPatient.value = null;
    }
    editingPrescription.value = null;
    resetForm();
  }, 200);
}

// History & Meal Plan Logic
function viewHistory(patient) {
  selectedPatient.value = patient;
  isHistoryModalOpen.value = true;
}

function closeHistoryModal() {
  isHistoryModalOpen.value = false;
  setTimeout(() => {
    if (!isModalOpen.value && !isMealModalOpen.value) {
      selectedPatient.value = null;
    }
  }, 200);
}

function viewMealPlan(patient) {
  selectedPatient.value = patient;
  isMealModalOpen.value = true;
}

function closeMealModal() {
  isMealModalOpen.value = false;
  setTimeout(() => {
    if (!isModalOpen.value && !isHistoryModalOpen.value) {
      selectedPatient.value = null;
    }
  }, 200);
}

// Form Arrays Handling
function addAllergy() {
  const newAllergy = allergyInput.value.trim();
  if (newAllergy && !prescriptionForm.value.allergies.includes(newAllergy)) {
    prescriptionForm.value.allergies.push(newAllergy);
  }
  allergyInput.value = '';
}

function removeAllergy(index) {
  prescriptionForm.value.allergies.splice(index, 1);
}

function addRestriction() {
  if (restrictionInput.value.trim()) {
    prescriptionForm.value.restrictions.push(restrictionInput.value.trim());
    restrictionInput.value = '';
  }
}

function removeRestriction(index) {
  prescriptionForm.value.restrictions.splice(index, 1);
}

// Submission
function handleSubmit() {
  if (!selectedPatient.value) return;

  const prescription = {
    id: editingPrescription.value?.id || `RX${String(dataStore.prescriptions.length + 1).padStart(3, '0')}`,
    patientId: selectedPatient.value.id,
    patientName: selectedPatient.value.name,
    doctorId: authStore.currentUser?.id || 'DOC001',
    doctorName: authStore.currentUser?.name || 'Dr. Santos',
    dietType: prescriptionForm.value.dietTypes.join(', ') || prescriptionForm.value.dietType,
    allergies: prescriptionForm.value.allergies,
    restrictions: prescriptionForm.value.restrictions,
    medicalOrders: prescriptionForm.value.medicalOrders,
    feedingInstructions: prescriptionForm.value.feedingInstructions,
    createdAt: editingPrescription.value?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Active'
  };

  if (editingPrescription.value) {
    const index = dataStore.prescriptions.findIndex((p) => p.id === prescription.id);
    if (index !== -1) {
      dataStore.prescriptions[index] = prescription;
    }
  } else {
    dataStore.addPrescription(prescription);
  }

  closeModal();
}

// Patient Details & Editing Modal Logic
function openPatientDetailsModal(patient) {
  selectedPatient.value = patient;
  patientForm.value = {
    name: patient.name || '',
    age: patient.age || 0,
    gender: patient.gender || 'Male',
    dob: patient.dob || '',
    contactNumber: patient.contactNumber || '',
    address: patient.address || '',
    room: patient.room || '',
    condition: patient.condition || '',
    physician: patient.physician || '',
    height: patient.height,
    weight: patient.weight,
    bloodType: patient.bloodType || '',
    allergies: patient.allergies || '',
    admissionType: patient.admissionType || '',
    emergencyContactName: patient.emergencyContactName || '',
    emergencyContactRel: patient.emergencyContactRel || '',
    emergencyContactNumber: patient.emergencyContactNumber || '',
    status: patient.status || 'Active'
  };
  isEditingPatient.value = false;
  isPatientModalOpen.value = true;
}

function closePatientModal() {
  isPatientModalOpen.value = false;
  setTimeout(() => {
    selectedPatient.value = null;
    isEditingPatient.value = false;
  }, 200);
}

function savePatientDetails() {
  if (!selectedPatient.value) return;
  dataStore.updatePatient(selectedPatient.value.id, patientForm.value);
  isEditingPatient.value = false;
  closePatientModal();
}

function resetForm() {
  prescriptionForm.value = {
    dietType: '',
    dietTypes: [],
    allergies: [],
    restrictions: [],
    medicalOrders: '',
    feedingInstructions: ''
  };
  allergyInput.value = '';
  restrictionInput.value = '';
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
