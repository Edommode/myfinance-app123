import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const usePremiumAccess=()=>{
 const {user}=useAuth(); const [loading,setLoading]=useState(true); const [plan,setPlan]=useState("free");
 useEffect(()=>{let active=true;const load=async()=>{if(!user){if(active){setPlan("free");setLoading(false)}return}const {data}=await supabase.from("user_subscriptions").select("plan,status,current_period_end").eq("user_id",user.id).maybeSingle();if(!active)return;const valid=Boolean(data&&["active","trialing"].includes(data.status)&&(!data.current_period_end||new Date(data.current_period_end)>new Date()));setPlan(valid?data!.plan:"free");setLoading(false)};void load();return()=>{active=false}},[user]);
 return {loading,plan,isPremium:plan==="premium"||plan==="coaching_plus"};
};
