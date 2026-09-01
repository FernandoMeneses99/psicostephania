// Tipos generados de la base de datos Supabase.
// Regenerar con: supabase gen types typescript --project-id <ref> --schema public > lib/types/database.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'admin' | 'staff'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'admin' | 'staff'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'admin' | 'staff'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          duration_minutes: number | null
          modality: 'presencial' | 'virtual' | 'hibrida' | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration_minutes?: number | null
          modality?: 'presencial' | 'virtual' | 'hibrida' | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration_minutes?: number | null
          modality?: 'presencial' | 'virtual' | 'hibrida' | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          full_name: string
          email: string | null
          phone: string | null
          document_type: string | null
          document_number: string | null
          birth_date: string | null
          status: 'activo' | 'inactivo' | 'archivado'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email?: string | null
          phone?: string | null
          document_type?: string | null
          document_number?: string | null
          birth_date?: string | null
          status?: 'activo' | 'inactivo' | 'archivado'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          document_type?: string | null
          document_number?: string | null
          birth_date?: string | null
          status?: 'activo' | 'inactivo' | 'archivado'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointment_requests: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          message: string | null
          preferred_service_id: string | null
          status:
            | 'pendiente'
            | 'en_revision'
            | 'contactado'
            | 'programada'
            | 'rechazada'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          message?: string | null
          preferred_service_id?: string | null
          status?: 'pendiente' | 'en_revision' | 'contactado' | 'programada' | 'rechazada'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          message?: string | null
          preferred_service_id?: string | null
          status?: 'pendiente' | 'en_revision' | 'contactado' | 'programada' | 'rechazada'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          id: string
          patient_id: string | null
          service_id: string | null
          request_id: string | null
          starts_at: string
          ends_at: string
          status:
            | 'solicitud_pendiente'
            | 'programada'
            | 'confirmada'
            | 'realizada'
            | 'cancelada'
            | 'no_asistio'
          virtual_link: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          service_id?: string | null
          request_id?: string | null
          starts_at: string
          ends_at: string
          status?: 'solicitud_pendiente' | 'programada' | 'confirmada' | 'realizada' | 'cancelada' | 'no_asistio'
          virtual_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          service_id?: string | null
          request_id?: string | null
          starts_at?: string
          ends_at?: string
          status?: 'solicitud_pendiente' | 'programada' | 'confirmada' | 'realizada' | 'cancelada' | 'no_asistio'
          virtual_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'appointments_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'appointments_request_id_fkey'
            columns: ['request_id']
            isOneToOne: false
            referencedRelation: 'appointment_requests'
            referencedColumns: ['id']
          },
        ]
      }
      clinical_records: {
        Row: {
          id: string
          patient_id: string
          general_info: Json
          reason_for_consultation: string | null
          antecedents: Json
          family_context: Json
          social_context: Json
          initial_evaluation: Json
          therapeutic_goals: Json
          intervention_plan: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          general_info?: Json
          reason_for_consultation?: string | null
          antecedents?: Json
          family_context?: Json
          social_context?: Json
          initial_evaluation?: Json
          therapeutic_goals?: Json
          intervention_plan?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          general_info?: Json
          reason_for_consultation?: string | null
          antecedents?: Json
          family_context?: Json
          social_context?: Json
          initial_evaluation?: Json
          therapeutic_goals?: Json
          intervention_plan?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clinical_records_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: true
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      clinical_sessions: {
        Row: {
          id: string
          patient_id: string
          appointment_id: string | null
          session_date: string
          observations: string | null
          evolution: string | null
          next_steps: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          appointment_id?: string | null
          session_date: string
          observations?: string | null
          evolution?: string | null
          next_steps?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          appointment_id?: string | null
          session_date?: string
          observations?: string | null
          evolution?: string | null
          next_steps?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'clinical_sessions_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'clinical_sessions_appointment_id_fkey'
            columns: ['appointment_id']
            isOneToOne: false
            referencedRelation: 'appointments'
            referencedColumns: ['id']
          },
        ]
      }
      follow_ups: {
        Row: {
          id: string
          patient_id: string
          session_id: string | null
          follow_up_date: string
          observations: string | null
          goals: Json
          status: 'pendiente' | 'en_proceso' | 'completado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          session_id?: string | null
          follow_up_date?: string
          observations?: string | null
          goals?: Json
          status?: 'pendiente' | 'en_proceso' | 'completado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          session_id?: string | null
          follow_up_date?: string
          observations?: string | null
          goals?: Json
          status?: 'pendiente' | 'en_proceso' | 'completado'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'follow_ups_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'follow_ups_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'clinical_sessions'
            referencedColumns: ['id']
          },
        ]
      }
      documents: {
        Row: {
          id: string
          patient_id: string | null
          document_type: string
          title: string
          storage_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          document_type: string
          title: string
          storage_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          document_type?: string
          title?: string
          storage_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'documents_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      consent_versions: {
        Row: {
          id: string
          version: number
          content: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          version: number
          content: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          version?: number
          content?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      consents: {
        Row: {
          id: string
          patient_id: string
          consent_version_id: string | null
          accepted_at: string | null
          accepted_by: string | null
          evidence: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          consent_version_id?: string | null
          accepted_at?: string | null
          accepted_by?: string | null
          evidence?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          consent_version_id?: string | null
          accepted_at?: string | null
          accepted_by?: string | null
          evidence?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'consents_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'consents_consent_version_id_fkey'
            columns: ['consent_version_id']
            isOneToOne: false
            referencedRelation: 'consent_versions'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          id: string
          patient_id: string | null
          service_id: string | null
          amount: number
          payment_date: string
          method: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro' | null
          status: 'pendiente' | 'recibido' | 'reembolsado'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id?: string | null
          service_id?: string | null
          amount: number
          payment_date?: string
          method?: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro' | null
          status?: 'pendiente' | 'recibido' | 'reembolsado'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string | null
          service_id?: string | null
          amount?: number
          payment_date?: string
          method?: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro' | null
          status?: 'pendiente' | 'recibido' | 'reembolsado'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payments_service_id_fkey'
            columns: ['service_id']
            isOneToOne: false
            referencedRelation: 'services'
            referencedColumns: ['id']
          },
        ]
      }
      receipts: {
        Row: {
          id: string
          payment_id: string | null
          receipt_number: string
          storage_path: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          payment_id?: string | null
          receipt_number: string
          storage_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          payment_id?: string | null
          receipt_number?: string
          storage_path?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'receipts_payment_id_fkey'
            columns: ['payment_id']
            isOneToOne: false
            referencedRelation: 'payments'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {}
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      handle_new_user: {
        Args: Record<string, never>
        Returns: undefined
      }
      promote_first_user: {
        Args: Record<string, never>
        Returns: undefined
      }
      set_updated_at: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: {}
    CompositeTypes: {}
  }
}