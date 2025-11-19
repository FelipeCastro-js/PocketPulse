import { colors, radius } from "@/constants/theme";
import { getFilePath } from "@/services/imageService";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as Icons from "phosphor-react-native";
import * as React from "react";
import {
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Typo from "./Typo";

type ImageUploadProps = {
  file?: any | null;
  onSelect: (file: any) => void;
  onClear: () => void;
  placeholder?: string;

  style?: ViewStyle;
  imageStyle?: ImageStyle;
  iconColor?: string;
  borderColor?: string;
  textColor?: string;

  containerStyle?: ViewStyle;
};

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  placeholder = "",
  style,
  imageStyle,
  iconColor,
  borderColor,
  textColor,
  containerStyle,
}: ImageUploadProps) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) onSelect(result.assets?.[0]);
  };

  const resolvedBorderColor = borderColor ?? colors.neutral300;
  const resolvedIconColor = iconColor ?? colors.primary;
  const resolvedTextColor = textColor ?? colors.neutral600;

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.inputContainer,
            { borderColor: resolvedBorderColor },
            containerStyle,
            style,
          ]}
        >
          <Icons.UploadSimple
            color={resolvedIconColor}
            size={verticalScale(20)}
            weight="bold"
          />
          {placeholder ? (
            <Typo size={15} color={resolvedTextColor}>
              {placeholder}
            </Typo>
          ) : null}
        </TouchableOpacity>
      )}

      {file && (
        <View style={[styles.image, imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity onPress={onClear} style={styles.deleteIcon}>
            <Icons.XCircle
              color={colors.white}
              size={verticalScale(24)}
              weight="fill"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  image: {
    height: scale(150),
    width: scale(150),
    borderRadius: radius._15,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: colors.neutral200,
  },
  inputContainer: {
    height: verticalScale(54),
    backgroundColor: colors.neutral100,
    borderRadius: radius._15,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  deleteIcon: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
