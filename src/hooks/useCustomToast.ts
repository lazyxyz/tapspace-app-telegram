import { toast } from "sonner";
const useCustomToast = () => {
  const showToast = () => {
    toast("This is a stacked notification!", {
      position: "bottom-left",
      duration: 5000,
      style: {
        // Custom styles
        maxWidth: "350px",
        marginBottom: "10px",
      },
    });
  };

  return { showToast };
};

export default useCustomToast;
