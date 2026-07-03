import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../stores/appStore";
import { useUIStore } from "../stores/useUIStore";

// ========================================
// Layer 1: Zustand Store 测试
// ========================================

describe("appStore", () => {
  beforeEach(() => {
    // 重置 store 到初始状态
    useAppStore.setState({
      notes: [],
      clipboard: [],
      tags: [],
      settings: null,
      loaded: false,
    });
  });

  it("should have initial empty state", () => {
    const state = useAppStore.getState();
    expect(state.notes).toEqual([]);
    expect(state.clipboard).toEqual([]);
    expect(state.tags).toEqual([]);
    expect(state.settings).toBeNull();
    expect(state.loaded).toBe(false);
  });

  it("should set notes correctly", () => {
    const mockNotes = [
      { id: "1", content: "Test 1", created_at: 1, updated_at: 1, pinned: false, tags: [], category: null, archived: false, deleted_at: null },
      { id: "2", content: "Test 2", created_at: 2, updated_at: 2, pinned: true, tags: [], category: null, archived: false, deleted_at: null },
    ];
    useAppStore.getState().setNotes(mockNotes);
    expect(useAppStore.getState().notes).toHaveLength(2);
    expect(useAppStore.getState().notes[1].content).toBe("Test 2");
  });

  it("should toggle pin state of a note", () => {
    useAppStore.getState().setNotes([
      { id: "1", content: "Test", created_at: 1, updated_at: 1, pinned: false, tags: [], category: null, archived: false, deleted_at: null },
    ]);
    // 手动切换 pin (模拟 togglePin 行为)
    const note = useAppStore.getState().notes[0];
    useAppStore.getState().setNotes([{ ...note, pinned: !note.pinned }]);
    expect(useAppStore.getState().notes[0].pinned).toBe(true);
  });

  it("should have initial empty clipboard", () => {
    expect(useAppStore.getState().clipboard).toEqual([]);
  });
});

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      activeTab: "notes",
      searchQuery: "",
      selectedTagId: null,
      editorMode: "edit",
      showArchived: false,
      showDeleted: false,
      clipboardSearchQuery: "",
      globalSearchOpen: false,
      globalSearchQuery: "",
      globalSearchResults: [],
      loaded: false,
    });
  });

  it("should start with notes tab active", () => {
    expect(useUIStore.getState().activeTab).toBe("notes");
  });

  it("should switch tabs correctly", () => {
    useUIStore.getState().setActiveTab("clipboard");
    expect(useUIStore.getState().activeTab).toBe("clipboard");
    useUIStore.getState().setActiveTab("settings");
    expect(useUIStore.getState().activeTab).toBe("settings");
    useUIStore.getState().setActiveTab("notes");
    expect(useUIStore.getState().activeTab).toBe("notes");
  });

  it("should open and close global search", () => {
    useUIStore.getState().openGlobalSearch();
    expect(useUIStore.getState().globalSearchOpen).toBe(true);
    expect(useUIStore.getState().globalSearchQuery).toBe("");
    expect(useUIStore.getState().globalSearchResults).toEqual([]);

    useUIStore.getState().setGlobalSearchQuery("test query");
    expect(useUIStore.getState().globalSearchQuery).toBe("test query");

    useUIStore.getState().closeGlobalSearch();
    expect(useUIStore.getState().globalSearchOpen).toBe(false);
  });

  it("should toggle showArchived and showDeleted exclusively", () => {
    useUIStore.getState().setShowArchived(true);
    expect(useUIStore.getState().showArchived).toBe(true);
    expect(useUIStore.getState().showDeleted).toBe(false);

    useUIStore.getState().setShowDeleted(true);
    expect(useUIStore.getState().showArchived).toBe(false);
    expect(useUIStore.getState().showDeleted).toBe(true);
  });

  it("should switch editor mode", () => {
    useUIStore.getState().setEditorMode("preview");
    expect(useUIStore.getState().editorMode).toBe("preview");
    useUIStore.getState().setEditorMode("edit");
    expect(useUIStore.getState().editorMode).toBe("edit");
  });

  it("should update search query", () => {
    useUIStore.getState().setSearchQuery("find me");
    expect(useUIStore.getState().searchQuery).toBe("find me");
  });
});