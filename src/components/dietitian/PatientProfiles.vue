<template>
  <div class="space-y-6">
    <!-- Header Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
          <Users :size="20" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-green-700 leading-none mb-1">{{ totalPatients }}</h3>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Active Patient Profiles</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <User :size="20" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-blue-750 leading-none mb-1">{{ malePatients }}</h3>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Male Patients</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center space-x-4">
        <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
          <User :size="20" />
        </div>
        <div>
          <h3 class="text-2xl font-bold text-pink-700 leading-none mb-1">{{ femalePatients }}</h3>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Female Patients</p>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="relative flex-1 md:max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search :size="18" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search patients by name or room..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 outline-none text-sm bg-white transition-all"
        />
      </div>

      <div class="flex items-center space-x-3">
        <select
          v-model="genderFilter"
          class="px-4 py-2.5 border border-gray-200 rounded-xl focus:border-green-600 outline-none text-sm bg-white transition-all"
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>
    </div>

    <!-- Patient Directory Table -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-600 uppercase tracking-wider">
              <th class="px-6 py-4">Patient Name</th>
              <th class="px-6 py-4">Age / Gender</th>
              <th class="px-6 py-4">Room & Bed</th>
              <th class="px-6 py-4">Clinical Diagnosis</th>
              <th class="px-6 py-4">Height & Weight</th>
              <th class="px-6 py-4">Attending Physician</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr 
              v-for="p in filteredPatients" 
              :key="p.id"
              class="hover:bg-gray-50/40 transition-colors"
            >
              <!-- Name -->
              <td class="px-6 py-4 align-top">
                <button 
                  @click="openDetailsModal(p)"
                  class="font-bold text-green-600 hover:text-green-800 hover:underline text-left focus:outline-none text-sm transition-colors"
                >
                  {{ p.name }}
                </button>
                <div class="flex items-center text-[10px] text-gray-400 mt-1 font-medium">
                  <Calendar :size="10" class="mr-1" />
                  Admitted: {{ formatDate(p.admissionDate) }}
                </div>
              </td>

              <!-- Age & Gender -->
              <td class="px-6 py-4 align-top text-sm text-gray-700">
                {{ p.age }} yrs / {{ p.gender }}
              </td>

              <!-- Room -->
              <td class="px-6 py-4 align-top">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 border border-green-100">
                  Room {{ p.room }}
                </span>
              </td>

              <!-- Diagnosis -->
              <td class="px-6 py-4 align-top text-sm text-gray-600">
                {{ p.condition }}
              </td>

              <!-- Height & Weight -->
              <td class="px-6 py-4 align-top text-sm text-gray-600">
                <span v-if="p.height || p.weight" class="font-medium">
                  {{ p.height ? p.height + ' cm' : '--' }} / {{ p.weight ? p.weight + ' kg' : '--' }}
                </span>
                <span v-else class="text-xs text-gray-400 italic">Not recorded</span>
              </td>

              <!-- Attending Doctor -->
              <td class="px-6 py-4 align-top text-sm text-gray-700 font-semibold">
                {{ p.physician }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 align-top">
                <div class="flex items-center justify-center">
                  <button 
                    @click="openDetailsModal(p)"
                    class="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <Pencil :size="12" class="mr-1" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredPatients.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                <Users :size="48" class="mx-auto mb-4 text-gray-200" />
                <p class="text-sm font-semibold">No patients matched the criteria.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Patient Details & Edit Modal -->
    <transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" @click.stop>
          <!-- Header -->
          <div class="px-6 md:px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <User :size="20" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ isEditing ? 'Edit Patient Profile' : 'Patient Information Card' }}
                </h2>
                <p class="text-xs text-gray-500 mt-0.5 font-semibold">ID: {{ selectedPatient?.id }}</p>
              </div>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
              <X :size="24" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 md:px-8 py-6 overflow-y-auto flex-1 bg-gray-50/30 space-y-6">
            <!-- Edit Mode -->
            <form v-if="isEditing" @submit.prevent="saveDetails" class="space-y-6">
              <!-- Section: Personal Details -->
              <div>
                <h3 class="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3 flex items-center">
                  <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Personal Details
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                    <input
                      v-model="patientForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                    <input
                      v-model="patientForm.dob"
                      type="date"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                    <input
                      v-model.number="patientForm.age"
                      type="number"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                    <select
                      v-model="patientForm.gender"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm bg-white transition-all"
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
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Complete Address</label>
                    <textarea
                      v-model="patientForm.address"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
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
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Clinical Diagnosis</label>
                    <input
                      v-model="patientForm.condition"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Height (cm)</label>
                      <input
                        v-model.number="patientForm.height"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Weight (kg)</label>
                      <input
                        v-model.number="patientForm.weight"
                        type="number"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Blood Type</label>
                      <select
                        v-model="patientForm.bloodType"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm bg-white transition-all"
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
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
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
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Admission Type</label>
                    <select
                      v-model="patientForm.admissionType"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm bg-white transition-all"
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
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm bg-white transition-all"
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
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Relationship</label>
                    <input
                      v-model="patientForm.emergencyContactRel"
                      type="text"
                      placeholder="e.g. Spouse, Parent"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
                    <input
                      v-model="patientForm.emergencyContactNumber"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 outline-none text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 shrink-0 bg-white">
                <button
                  type="button"
                  @click="isEditing = false"
                  class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center space-x-2 shadow-sm"
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
                  <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
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
                    <p class="font-bold text-green-700 mt-0.5">{{ selectedPatient?.condition }}</p>
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
                    <p class="font-bold text-green-700 mt-0.5">Room {{ selectedPatient?.room }}</p>
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
                  @click="closeModal"
                  class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-xl transition-colors"
                >
                  Close View
                </button>
                <button
                  type="button"
                  @click="isEditing = true"
                  class="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center space-x-2 shadow-sm"
                >
                  <Pencil :size="16" />
                  <span>Edit Profile</span>
                </button>
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
import {
  Users,
  User,
  Search,
  Calendar,
  X,
  Pencil,
  Save } from
'lucide-vue-next';

const dataStore = useDataStore();

const searchQuery = ref('');
const genderFilter = ref('all');

const isModalOpen = ref(false);
const isEditing = ref(false);
const selectedPatient = ref(null);

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

const activePatients = computed(() => {
  return dataStore.patients.filter((p) => p.status === 'Active');
});

const totalPatients = computed(() => activePatients.value.length);
const malePatients = computed(() => activePatients.value.filter((p) => p.gender === 'Male').length);
const femalePatients = computed(() => activePatients.value.filter((p) => p.gender === 'Female').length);

const filteredPatients = computed(() => {
  let patients = [...activePatients.value];

  if (genderFilter.value !== 'all') {
    patients = patients.filter((p) => p.gender === genderFilter.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    patients = patients.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.room.toLowerCase().includes(q) ||
    p.condition.toLowerCase().includes(q)
    );
  }

  return patients;
});

function openDetailsModal(patient) {
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
  isEditing.value = false;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedPatient.value = null;
    isEditing.value = false;
  }, 200);
}

function saveDetails() {
  if (!selectedPatient.value) return;
  dataStore.updatePatient(selectedPatient.value.id, patientForm.value);
  closeModal();
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${formattedDate} • ${formattedTime}`;
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
