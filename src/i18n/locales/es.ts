/**
 * Spanish translations — placeholder/partial
 *
 * Community contributions welcome! Copy en.ts and translate values.
 */
import type { TranslationKeys } from './en';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const es: DeepPartial<TranslationKeys> = {
  common: {
    cancel: 'Cancelar',
    close: 'Cerrar',
    save: 'Guardar',
    saving: 'Guardando…',
    delete: 'Eliminar',
    archive: 'Archivar',
    back: 'Atrás',
    continue: 'Continuar',
    error: 'Error',
    success: 'Éxito',
    tryAgain: 'Inténtalo de nuevo.',
    loading: 'Cargando',
    search: 'Buscar',
    done: 'Listo',
    ok: 'OK',
  },

  auth: {
    email: 'Correo electrónico',
    password: 'Contraseña',
    emailPlaceholder: 'Ingresa tu correo',
    passwordPlaceholder: 'Ingresa tu contraseña',
    createPassword: 'Crea una contraseña',
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar sesión',
    signOutConfirm: '¿Estás seguro de que quieres cerrar sesión?',
    continueWithApple: 'Continuar con Apple',
    continueWithGoogle: 'Continuar con Google',
    forgotPassword: '¿Olvidaste tu contraseña?',
  },

  habits: {
    habit: 'Hábito',
    createHabit: 'Crear Hábito',
    createAction: 'Crear hábito',
    habitName: 'Nombre del hábito',
    habitNamePlaceholder: 'ej., Leer 10 minutos',
    noHabitsYet: 'Aún no hay hábitos',
    getStarted: '¡Crea tu primer hábito para comenzar!',
  },

  settings: {
    title: 'Configuración',
    theme: 'Tema',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
  },

  analytics: {
    title: 'Analíticas',
  },

  dateTime: {
    days: {
      sunday: 'Domingo',
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
    },
    months: {
      january: 'Enero',
      february: 'Febrero',
      march: 'Marzo',
      april: 'Abril',
      may: 'Mayo',
      june: 'Junio',
      july: 'Julio',
      august: 'Agosto',
      september: 'Septiembre',
      october: 'Octubre',
      november: 'Noviembre',
      december: 'Diciembre',
    },
  },
};

export default es;
