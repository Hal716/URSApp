import Addclass from "@/compunents/Addclass";
import "@/global.css";
import { styled } from "nativewind";
import { SafeAreaView as URSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(URSafeAreaView);

export default function AddClassPage() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Addclass />
    </SafeAreaView>
  );
}
