import useAuth from "./useAuth";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function usePermissions(...permissions: string[]): boolean {
  const claims = useAuth();
  const router = useRouter()
  const [hasChecked, setHasChecked] = useState<boolean>(false)

  useEffect(() => {
    if (!claims) return;

    for (let permission of permissions) {
      if (!claims.permissions.find(p => p === permission)) {
        router.push("/")
        return
      }
    }

    setHasChecked(true)
  }, [router, permissions, claims]);

  return hasChecked
}