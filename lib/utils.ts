import {confirmAlert} from "react-confirm-alert";

export async function confirm(title: string, message: string): Promise<boolean> {
  return new Promise(resolve => {
    confirmAlert({
      title,
      message,
      buttons: [
        {
          label: 'Yes',
          onClick: () => resolve(true)
        },
        {
          label: 'No',
          onClick: () => resolve(false)
        }
      ]
    })
  })
}