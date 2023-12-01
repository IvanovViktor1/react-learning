
import { PostgrestError } from '@supabase/supabase-js'
  
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      group: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id: number
          name: string
        }
        Update: {
          id: number
          name: string
        }
        Relationships: []
      }
      question: {
        Row: {
          answers: Json | null
          id: number
          topic_id: number 
          title: string
        }
        Insert: {
          answers?: Json | null
          id?: number
          topic_id?: number 
          title: string
        } 
        Update: {
          answers?: Json | null
          id?: number
          topic_id?: number 
          title?: string
        }
        Relationships: []
      }
      result: {
        Row: {
          date: string
          errors: Json | null
          id: number
          score: number 
          topic_id: number
          user_id: string
          score_for: number | null
        }
        Insert: {
          date?: string
          errors?: Json | null
          id?: number
          score: number
          topic_id: number
          user_id: string
          score_for?: number | null
        }
        Update: {
          date?: string
          errors?: Json | null
          id?: number
          score?: number
          topic_id?: number
          user_id?: string
          score_for?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "result_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_score_for_fkey"
            columns: ["score_for"]
            referencedRelation: "modes"
            referencedColumns: ["id"]
          }
        ]
      },
      answer_to_task: {
        Row: {
          id: number
          id_task: number
          link: string
          date: string
          score: number 
          comments: string
          user_id: string
        }
        Insert: {
          id?: number
          id_task: number
          link: string
          date: string
          score?: number  | null
          comments?: string | null
          user_id: string
        }
        Update: {
          id?: number
          id_task?: number
          link?: string
          date?: string
          score?: number 
          comments?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answer_to_task_id_task_fkey"
            columns: ["id_task"]
            referencedRelation: "task"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_to_task_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_info"
            referencedColumns: ["user_id"]
          }
        ]
      }
      modes: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      task: {
        Row: {
          id: number
          description: string 
          link_id: number | null
          topic_id: number | null
          group_id: number 
          deadline: string
        }
        Insert: {
          id?: number
          description: string 
          link_id: number | null
          topic_id: number | null
          group_id: number
          deadline: string
        }
        Update: {
          id?: number
          description?: string 
          link_id?: number | null
          topic_id?: number | null
          group_id?: number
          deadline?: string
        }
        Relationships: [
          {
            foreignKeyName: "result_link_id_fkey"
            columns: ["link_id"]
            referencedRelation: "link"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "result_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "group"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          id: number
          qustions: Json | null
          qwerty: Json | null
          sumQuestions: number | null
          topic: string
        }
        Insert: {
          id?: never
          qustions?: Json | null
          qwerty?: Json | null
          sumQuestions?: number | null
          topic: string
        }
        Update: {
          id?: never
          qustions?: Json | null
          qwerty?: Json | null
          sumQuestions?: number | null
          topic?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          limitQuestions: number | null
          id: number
          title: string
        }
        Insert: {
          limitQuestions?: number | null
          id?: number
          title: string
        }
        Update: {
          limitQuestions?: number | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      type_link: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      link: {
        Row: {
          id: number 
          description: string
          link:string
          topic_id: number | null
          link_type_id: number | null
        }
        Insert: {
          id?: number | null
          description?: string
          link:string
          topic_id?: number | null
          link_type_id?: number | null
        }
        Update: {
          id?: number 
          description?: string
          link?:string
          topic_id?: number | null
          link_type_id?: number | null
        }
        Relationships: [
          {
          foreignKeyName: "link_link_type_id_fkey"
          columns: ["link_type_id"]
          referencedRelation: "type_link"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "link_topic_id_fkey"
          columns: ["topic_id"]
          referencedRelation: "topics"
          referencedColumns: ["id"]
        }
      ]
      }
      user_info: {
        Row: {
          group_id: number | null
          id: number
          name: string | null
          role_id: number | null
          user_id: string
          email: string | null
        }
        Insert: {
          group_id?: number | null
          id?: number
          name?: string | null
          role_id?: number | null
          user_id: string
          email:string | null
        }
        Update: {
          group_id?: number | null
          id?: number
          name?: string | null
          role_id?: number | null
          user_id?: string
          email:string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_info_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_info_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError
