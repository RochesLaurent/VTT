import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: 'Ce champ est obligatoire',
    oneOf: 'La valeur doit être l\'une des suivantes : ${values}',
    notOneOf: 'La valeur ne doit pas être l\'une des suivantes : ${values}',
  },
  string: {
    length: 'Ce champ doit contenir exactement ${length} caractères',
    min: 'Ce champ doit contenir au moins ${min} caractères',
    max: 'Ce champ doit contenir au maximum ${max} caractères',
    email: 'Ce champ doit être une adresse email valide',
    url: 'Ce champ doit être une URL valide',
  },
  boolean: {
    isValue: 'Ce champ doit être coché',
  },
});

const REGEX = {
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  
  NAME: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
};

export const authValidationSchemas = {
  login: yup.object({
    email: yup
      .string()
      .required()
      .email()
      .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
    
    password: yup
      .string()
      .required()
      .min(1, 'Le mot de passe est obligatoire'),
    
    rememberMe: yup
      .boolean()
      .default(false),
  }),

  register: yup.object({
    username: yup
      .string()
      .required()
      .matches(REGEX.USERNAME, 'Le nom d\'utilisateur doit contenir 3-20 caractères (lettres, chiffres, - et _)')
      .test('no-spaces', 'Le nom d\'utilisateur ne peut pas contenir d\'espaces', (value) => {
        return !value || !value.includes(' ');
      }),
    
    email: yup
      .string()
      .required()
      .email()
      .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
    
    firstname: yup
      .string()
      .required()
      .matches(REGEX.NAME, 'Le prénom doit contenir 2-50 caractères (lettres, espaces, tirets, apostrophes)')
      .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
    
    lastname: yup
      .string()
      .required()
      .matches(REGEX.NAME, 'Le nom doit contenir 2-50 caractères (lettres, espaces, tirets, apostrophes)')
      .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    
    password: yup
      .string()
      .required()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .matches(
        REGEX.STRONG_PASSWORD,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
      ),
    
    passwordConfirm: yup
      .string()
      .required('La confirmation du mot de passe est obligatoire')
      .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
    
    acceptTerms: yup
      .boolean()
      .required()
      .oneOf([true], 'Vous devez accepter les conditions d\'utilisation'),
  }),

  forgotPassword: yup.object({
    email: yup
      .string()
      .required()
      .email()
      .max(255, 'L\'email ne peut pas dépasser 255 caractères'),
  }),

  resetPassword: yup.object({
    token: yup
      .string()
      .required('Le token est manquant'),
    
    password: yup
      .string()
      .required()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .matches(
        REGEX.STRONG_PASSWORD,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
      ),
    
    passwordConfirm: yup
      .string()
      .required('La confirmation du mot de passe est obligatoire')
      .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
  }),
};

export const validateField = async (schema: yup.AnySchema, fieldName: string, value: any): Promise<string | null> => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'Erreur de validation';
  }
};

export const validateForm = async (schema: yup.AnySchema, data: any): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Erreur de validation' } };
  }
};

export const customValidators = {
  isUsernameAvailable: async (username: string): Promise<boolean> => {
    // TODO: Implémenter l'appel API pour vérifier la disponibilité
    // Pour l'instant, on retourne true
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },

  isEmailAvailable: async (email: string): Promise<boolean> => {
    // TODO: Implémenter l'appel API pour vérifier la disponibilité
    // Pour l'instant, on retourne true
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  },

  getPasswordStrength: (password: string): { score: number; feedback: string[] } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Au moins 8 caractères');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Au moins une minuscule');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Au moins une majuscule');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Au moins un chiffre');
    }

    if (/[@$!%*?&]/.test(password)) {
      score += 1;
      feedback.length === 0 && feedback.push('Excellent mot de passe !');
    } else if (score >= 4) {
      feedback.push('Ajoutez un caractère spécial pour plus de sécurité');
    }

    return { score, feedback };
  },
};

export const getApiErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.errors) {
    const firstError = Object.values(error.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0] as string;
    }
  }

  return 'Une erreur est survenue';
};