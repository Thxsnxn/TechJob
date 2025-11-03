// src/store/user.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ใช้ employeeCode เป็น unique key หลัก
const keyOf = (u) => String(u?.employeeCode ?? '').trim();

export const useUserStore = create()(
  persist(
    (set, get) => ({
      /* ---------------- State ---------------- */
      // รายการผู้ใช้ทั้งหมดสำหรับหน้าจัดการผู้ใช้
      users: [], // [{ employeeCode, password?, firstname, lastname, role, department, position, access }]
      // ผู้ใช้ที่เลือกอยู่บนหน้าแก้ไข (เช่นแถวที่ถูกเลือกในตาราง)
      selectedUserId: null, // = employeeCode
      // ผู้ใช้ที่ล็อกอินตอนนี้ (ถ้ามี)
      user: null,
      isAuthenticated: false,

      /* ---------------- Selectors (sync) ---------------- */
      getUserByCode: (employeeCode) => {
        const code = String(employeeCode ?? '').trim();
        return get().users.find((u) => keyOf(u) === code) || null;
      },

      /* ---------------- CRUD: Users Management ---------------- */
      setUsers: (list) => {
        // กรองรายการที่ไม่มี employeeCode ออก และกัน key ซ้ำ
        const seen = new Set();
        const normalized = [];
        for (const u of Array.isArray(list) ? list : []) {
          const k = keyOf(u);
          if (!k || seen.has(k)) continue;
          seen.add(k);
          normalized.push(u);
        }
        set({ users: normalized });
      },

      addUser: (newUser) => {
        const k = keyOf(newUser);
        if (!k) return; // ไม่เพิ่มถ้าไม่มี employeeCode
        const exists = get().users.some((u) => keyOf(u) === k);
        if (exists) {
          // ถ้าต้องการอนุญาตให้ทับ ให้เปลี่ยนเป็น updateUser(k, newUser)
          console.warn(`addUser: employeeCode '${k}' ซ้ำ`);
          return;
        }
        set({ users: [...get().users, newUser] });
      },

      updateUser: (employeeCode, patch) => {
        const code = keyOf({ employeeCode });
        if (!code) return;
        set({
          users: get().users.map((u) =>
            keyOf(u) === code ? { ...u, ...patch } : u
          ),
          // ถ้าแก้ไขตรงกับผู้ใช้ที่เลือกอยู่ ก็อัปเดต selectedUserId ให้ยังคงชี้คนเดิม
          selectedUserId:
            get().selectedUserId && get().selectedUserId === code
              ? code
              : get().selectedUserId,
          // ถ้าแก้ไขตรงกับ user ที่ล็อกอินอยู่ ให้อัปเดตด้วย
          user:
            get().user && keyOf(get().user) === code
              ? { ...get().user, ...patch }
              : get().user,
        });
      },

      removeUser: (employeeCode) => {
        const code = String(employeeCode ?? '').trim();
        set({
          users: get().users.filter((u) => keyOf(u) !== code),
          selectedUserId:
            get().selectedUserId === code ? null : get().selectedUserId,
          user:
            get().user && keyOf(get().user) === code ? null : get().user,
          isAuthenticated:
            get().user && keyOf(get().user) === code
              ? false
              : get().isAuthenticated,
        });
      },

      clearUsers: () => set({ users: [], selectedUserId: null }),

      selectUser: (employeeCode) => {
        const code = String(employeeCode ?? '').trim();
        const exists = get().users.some((u) => keyOf(u) === code);
        set({ selectedUserId: exists ? code : null });
      },

      /* ---------------- Auth (แยกจาก CRUD) ---------------- */
      login: (payload) => {
        // ถ้ามี record อยู่แล้วใน users ให้ merge จาก users เพื่อให้ข้อมูลล่าสุด
        const code = keyOf(payload);
        const fromList = code ? get().users.find((u) => keyOf(u) === code) : null;
        const merged = fromList ? { ...fromList, ...payload } : payload;

        set({
          user: merged, // password จะไม่ถูก persist (ตาม partialize)
          isAuthenticated: true,
        });
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      // อัปเดตข้อมูลผู้ใช้ที่ล็อกอินอยู่ (เช่นแก้ชื่อ-สกุลของตัวเอง)
      updateLoggedInUser: (patch) => {
        const current = get().user;
        if (!current) return;
        const code = keyOf(current);
        // อัปเดตทั้ง user ที่ล็อกอิน และใน users[]
        set({
          user: { ...current, ...patch },
          users: get().users.map((u) =>
            keyOf(u) === code ? { ...u, ...patch } : u
          ),
        });
      },

      // reset ทั้ง store (มักใช้ตอนเคลียร์ข้อมูลทั้งหมด)
      reset: () =>
        set({
          users: [],
          selectedUserId: null,
          user: null,
          isAuthenticated: false,
        }),

      /* ---------------- Utilities: Import/Export ---------------- */
      exportData: () => {
        // คืนค่าเฉพาะ fields ที่ปลอดภัย (จะตัด password ออกตอน persist อยู่แล้ว)
        const { users } = get();
        return JSON.parse(JSON.stringify(users));
      },

      importData: (list) => {
        // นำเข้ารายชื่อ (จะถูก setUsers ทำ normalization ให้)
        get().setUsers(list);
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // ตัด password ออกจาก user และ users ตอน persist
      partialize: (state) => {
        const stripPwd = (u) => {
          if (!u) return u;
          const { password, ...safe } = u;
          return safe;
        };
        return {
          users: Array.isArray(state.users) ? state.users.map(stripPwd) : [],
          selectedUserId: state.selectedUserId ?? null,
          user: stripPwd(state.user),
          isAuthenticated: !!state.isAuthenticated,
        };
      },
    }
  )
);

/* ===================== ตัวอย่างการใช้งาน =====================

import { useUserStore } from '@/store/user';

// เพิ่มผู้ใช้ใหม่
useUserStore.getState().addUser({
  employeeCode: 'ceo001',
  password: '1234',        // จะไม่ถูก persist
  firstname: 'Thastanon',
  lastname: 'Kaisomsat',
  role: 'CEO',
  department: 'IT',
  position: 'Developer',
  access: 'IT',
});

// อัปเดตผู้ใช้
useUserStore.getState().updateUser('ceo001', {
  position: 'Senior Developer',
});

// ลบผู้ใช้
useUserStore.getState().removeUser('ceo001');

// เลือกผู้ใช้ในหน้าแก้ไข
useUserStore.getState().selectUser('ceo001');

// ล็อกอินด้วย employeeCode เดียวกับที่อยู่ใน users (จะ merge ข้อมูลให้)
useUserStore.getState().login({
  employeeCode: 'ceo001',
  password: '1234',
});

// อัปเดตข้อมูลผู้ใช้ที่ล็อกอินอยู่
useUserStore.getState().updateLoggedInUser({ firstname: 'Than' });

// รีเซ็ตทั้งหมด
useUserStore.getState().reset();

=============================================================== */
