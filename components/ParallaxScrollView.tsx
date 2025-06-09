import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{ isPadding?: boolean; scrollRef?: any }>;

export default function ParallaxScrollView({
  children,
  isPadding = true,
  scrollRef,
}: Props) {
  const localScrollRef = useAnimatedRef<Animated.ScrollView>();
  const refToUse = scrollRef || localScrollRef;
  const bottom = useBottomTabOverflow();

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={refToUse}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
        <ThemedView style={[styles.content, { padding: isPadding ? 20 : 0 }]}>
          {children}
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    overflow: "hidden",
  },
});
