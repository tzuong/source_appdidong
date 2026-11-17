import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from './src/screens/DashboardScreen';
import DevicesScreen from './src/screens/DevicesScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useSmartOffice } from './src/hooks/useSmartOffice';
import { C } from './src/theme';

const tabs = [
  { key: 'home', name: 'Tổng quan', icon: 'grid-outline', active: 'grid' },
  { key: 'devices', name: 'Thiết bị', icon: 'bulb-outline', active: 'bulb' },
  { key: 'activity', name: 'Nhật ký', icon: 'time-outline', active: 'time' },
  { key: 'settings', name: 'Cài đặt', icon: 'settings-outline', active: 'settings' },
];

function SmartOfficeApp() {
  const [tab, setTab] = useState('home');
  const [mode, setMode] = useState('demo');
  const [draft, setDraft] = useState({ url: '', username: '', password: '' });
  const [activeConfig, setActiveConfig] = useState(null);
  const office = useSmartOffice({ mode, config: activeConfig });

  function changeMode(next) {
    setActiveConfig(null);
    setMode(next);
  }

  function connectMqtt() {
    const url = draft.url.trim();
    if (!/^wss?:\/\/[^\s/]+/i.test(url)) {
      Alert.alert('URL không hợp lệ', 'Nhập ws:// hoặc wss:// kèm địa chỉ và cổng WebSocket của Broker.');
      return;
    }
    setActiveConfig({ ...draft, url });
  }

  let screen;
  if (tab === 'home') screen = <DashboardScreen office={office} mode={mode} onSettings={() => setTab('settings')} onDevices={() => setTab('devices')} />;
  else if (tab === 'devices') screen = <DevicesScreen office={office} mode={mode} />;
  else if (tab === 'activity') screen = <ActivityScreen logs={office.logs} onClear={office.clearLogs} />;
  else screen = <SettingsScreen office={office} mode={mode} onModeChange={changeMode} draft={draft} setDraft={setDraft} onConnect={connectMqtt} onDisconnect={() => setActiveConfig(null)} />;

  return (
    <SafeAreaView style={styles.app} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>{screen}</View>
      <View style={styles.nav}>
        {tabs.map((item) => (
          <TouchableOpacity key={item.key} onPress={() => setTab(item.key)} style={styles.navItem} accessibilityRole="tab" accessibilityState={{ selected: tab === item.key }}>
            <Ionicons name={tab === item.key ? item.active : item.icon} size={23} color={tab === item.key ? C.aqua : C.muted} />
            <Text style={[styles.navLabel, tab === item.key && styles.navActive]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><SmartOfficeApp /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  nav: { flexDirection: 'row', backgroundColor: '#0C1C30', borderTopColor: C.border, borderTopWidth: 1, paddingTop: 12, paddingBottom: 6 },
  navItem: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 2 },
  navLabel: { color: C.muted, fontSize: 10, fontWeight: '600' },
  navActive: { color: C.aqua, fontWeight: '800' },
});
