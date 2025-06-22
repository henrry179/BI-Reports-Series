# Cursor 开发流程规则（rules01 - 升级版 v4.0）

## 🕐 实时时间记录原则（新增强化要求）

**重要提醒**: 每次开发更新必须使用**当前实时日期和时间**，格式严格为 `YYYY-MM-DD HH:MM:SS`。这是为了确保开发进度时间表的准确性和实时性，便于追踪每个模块的具体开发时间节点。

---

## 📋 核心开发流程规则

### 1. **实时进度记录要求** ⏰
   - **每次优化任何模块的功能，都必须将优化的进度和内容详细更新到 `README.md` 文档中**
   - **时间记录格式**: 严格使用 `YYYY-MM-DD HH:MM:SS` 格式（24小时制）
   - **时间获取方式**: 使用当前系统的实时时间，不得使用预设或估算时间
   - **记录内容包括**：
     - 优化的模块名称和文件路径
     - 具体的优化内容和改进点
     - 优化前后的对比说明
     - 已完成与待完成事项的明确状态
     - 相关的技术难点和解决方案
     - 性能提升或功能增强的量化指标

### 2. **文档同步推送流程** 🚀
   - **每次将优化进度更新到 `README.md` 文档后，必须立即将优化后的进度推送到 GitHub 仓库**
   - **标准操作流程**：
     ```bash
     # 第一步：添加所有变更文件
     git add .
     
     # 第二步：提交变更（使用实时时间戳）
     git commit -m "更新README，记录[模块名称]优化进度 - $(date '+%Y-%m-%d %H:%M:%S')"
     
     # 第三步：推送到远程仓库
     git push
     ```
   - **提交信息规范**: 必须包含优化的模块名称和当前时间戳
   - **推送验证**: 确保每次优化和文档同步后，远程仓库始终保持最新进度状态

### 3. **持续迭代检查机制** 🔄
   - **每次将优化更新内容推送到 GitHub 后，需重新检查项目的其他文件和模块功能**
   - **系统化检查方式**：
     - 审查 `README.md` 的"开发进度"板块，明确剩余开发任务的优先级
     - 检查代码目录和模块，识别未完成、可优化或存在技术债务的部分
     - 分析用户反馈和Issues，确定下一阶段的开发重点
     - 评估当前版本的稳定性和性能表现
   - **迭代开发流程**：
     1. **目标明确**: 基于检查结果确定下一个具体的开发目标
     2. **计划制定**: 估算开发时间和所需资源
     3. **实施开发**: 按照上述规则进行开发、记录、推送
     4. **质量验证**: 确保功能完整性和代码质量
     5. **循环迭代**: 重复整个流程直至项目完成

### 4. **30秒轻音乐提醒系统** 🎵
   - **每次自动完成进度任务后，必须播放30秒左右的轻音乐提醒用户任务已完成**
   - **音频提醒触发条件**：
     - README.md开发进度更新完成后
     - Git推送到远程仓库成功后
     - 关键模块功能优化完成后
     - 测试验证通过后
     - 文档同步更新完成后

#### 🎼 30秒轻音乐分级提醒策略

##### 🎵 重大成就 - 30秒古典轻音乐
**适用场景**: 项目重大功能完成、架构升级、版本发布
```bash
# 方案1: 使用Music App播放古典轻音乐
play_achievement_music() {
    osascript <<EOF
    tell application "Music"
        if it is running then
            set currentVolume to sound volume of (get sound volume settings)
            set volume output volume 30
            
            # 搜索并播放古典轻音乐（如果用户音乐库中有）
            set searchResults to (search playlist "轻音乐" for "古典")
            if searchResults is not {} then
                play (item 1 of searchResults)
                delay 30
                pause
            else
                # 备用方案：播放预设轻音乐文件
                do shell script "afplay /Users/mac/Music/LightMusic/achievement.mp3 &"
            end if
            
            set volume output volume currentVolume
        end if
    end tell
EOF
    say "🎼 重大成就达成！优美的古典轻音乐为您庆祝这个里程碑！" --voice="Ting-Ting" --rate=200
}
```

##### 🎹 代码优化 - 30秒钢琴轻音乐
**适用场景**: 代码重构、性能优化、算法改进、bug修复
```bash
# 优雅的钢琴轻音乐提醒
play_optimization_music() {
    osascript <<EOF
    tell application "Music"
        if it is running then
            set currentVolume to sound volume of (get sound volume settings)
            set volume output volume 25
            
            # 搜索钢琴轻音乐
            set searchResults to (search playlist "轻音乐" for "钢琴")
            if searchResults is not {} then
                play (item 1 of searchResults)
                delay 30
                pause
            else
                # 备用：播放预设钢琴轻音乐
                do shell script "afplay /Users/mac/Music/LightMusic/piano_light.mp3 &"
            end if
            
            set volume output volume currentVolume
        end if
    end tell
EOF
    say "🎹 代码优化完成，请欣赏这段优雅的钢琴轻音乐！" --voice="Mei-Jia" --rate=180
}

# 使用TTS生成30秒音乐般的语音提醒
play_tts_music_reminder() {
    # 创建30秒的音乐化语音提醒
    say "代码优化已完成。" --voice="Mei-Jia" --rate=120 &
    sleep 3
    say "这次优化提升了代码的优雅性和性能。" --voice="Mei-Jia" --rate=110 &
    sleep 5
    say "就像美妙的钢琴曲一样，代码现在更加和谐。" --voice="Mei-Jia" --rate=100 &
    sleep 8
    say "请回来查看这次精彩的改进成果。" --voice="Mei-Jia" --rate=120
}
```

##### 🎶 日常任务 - 30秒自然轻音乐
**适用场景**: 文档更新、配置修改、测试完成、日常提交
```bash
# 自然系轻音乐提醒
play_daily_music() {
    osascript <<EOF
    tell application "Music"
        if it is running then
            set currentVolume to sound volume of (get sound volume settings)
            set volume output volume 20
            
            # 搜索自然轻音乐或New Age音乐
            set searchResults to (search playlist "轻音乐" for "自然")
            if searchResults is not {} then
                play (item 1 of searchResults)
                delay 30
                pause
            else
                # 备用：播放预设自然轻音乐
                do shell script "afplay /Users/mac/Music/LightMusic/nature_light.mp3 &"
            end if
            
            set volume output volume currentVolume
        end if
    end tell
EOF
    say "🎶 日常任务完成，享受这段舒缓的轻音乐放松时刻！" --voice="Sin-ji" --rate=160
}

# 创建自然音效+轻音乐的混合提醒
play_nature_music_reminder() {
    # 播放30秒的自然音效序列
    echo "🎶 播放30秒自然轻音乐提醒..."
    
    # 鸟鸣声 + 语音
    (for i in {1..10}; do afplay /System/Library/Sounds/Ping.aiff; sleep 0.8; done) &
    sleep 2
    say "日常任务已完成，" --voice="Sin-ji" --rate=100 &
    sleep 5
    
    # 水滴声 + 语音  
    (for i in {1..8}; do afplay /System/Library/Sounds/Tink.aiff; sleep 1.2; done) &
    sleep 3
    say "就像自然中的和谐旋律，" --voice="Sin-ji" --rate=90 &
    sleep 8
    
    # 轻柔音效 + 结束语音
    (for i in {1..5}; do afplay /System/Library/Sounds/Purr.aiff; sleep 1.5; done) &
    sleep 2
    say "请回来查看更新的进度。" --voice="Sin-ji" --rate=120
    
    echo "✅ 30秒自然轻音乐提醒播放完成"
}
```

#### 🎵 轻音乐资源管理系统
```bash
# 创建轻音乐资源目录
setup_light_music_library() {
    local music_dir="/Users/mac/Music/LightMusic"
    
    if [[ ! -d "$music_dir" ]]; then
        mkdir -p "$music_dir"
        echo "📁 创建轻音乐目录: $music_dir"
    fi
    
    # 下载免费轻音乐资源（创作共用许可）
    echo "🎵 下载30秒轻音乐资源..."
    
    # 古典轻音乐 - 适合重大成就
    curl -s "https://freemusicarchive.org/track/Bach_Cello_Suite_No_1_i_Prelude/download/" \
         -o "$music_dir/classical_achievement.mp3" 2>/dev/null || \
    echo "⚠️  请手动添加古典轻音乐文件到 $music_dir/classical_achievement.mp3"
    
    # 钢琴轻音乐 - 适合代码优化
    curl -s "https://freemusicarchive.org/track/Chopin_Minute_Waltz/download/" \
         -o "$music_dir/piano_optimization.mp3" 2>/dev/null || \
    echo "⚠️  请手动添加钢琴轻音乐文件到 $music_dir/piano_optimization.mp3"
    
    # 自然轻音乐 - 适合日常任务
    curl -s "https://freemusicarchive.org/track/Peaceful_Nature_Sounds/download/" \
         -o "$music_dir/nature_daily.mp3" 2>/dev/null || \
    echo "⚠️  请手动添加自然轻音乐文件到 $music_dir/nature_daily.mp3"
    
    echo "✅ 轻音乐资源库设置完成"
    echo "💡 建议：您可以将喜欢的30秒轻音乐文件放入 $music_dir 目录"
}

# 智能轻音乐播放器
play_smart_light_music() {
    local task_type="$1"
    local music_dir="/Users/mac/Music/LightMusic"
    local music_file=""
    
    case "$task_type" in
        "achievement")
            music_file="$music_dir/classical_achievement.mp3"
            [[ -f "$music_file" ]] && timeout 30 afplay "$music_file" &
            ;;
        "optimization")
            music_file="$music_dir/piano_optimization.mp3"
            [[ -f "$music_file" ]] && timeout 30 afplay "$music_file" &
            ;;
        "daily")
            music_file="$music_dir/nature_daily.mp3"
            [[ -f "$music_file" ]] && timeout 30 afplay "$music_file" &
            ;;
    esac
    
    # 如果没有音乐文件，使用自然音效组合
    if [[ ! -f "$music_file" ]]; then
        echo "🎵 使用自然音效组合创建30秒轻音乐体验..."
        play_nature_music_reminder
    fi
}
```

#### 🎭 智能轻音乐提醒策略
- **工作时间(9:00-18:00)**: 音量调至20-25%，使用舒缓轻音乐
- **专注时间**: 音量调至15%，使用极简音乐或自然音效
- **深夜模式(22:00-8:00)**: 仅使用轻柔的自然音效，禁用语音
- **连续任务**: 延迟15秒播放，避免音乐重叠
- **用户在线检测**: 检测用户活动状态，调整提醒强度

#### 🎼 30秒轻音乐提醒触发条件
| 任务类型 | 触发条件 | 轻音乐类型 | 播放时长 | 音量级别 |
|---------|----------|------------|----------|----------|
| 重大功能开发 | 新功能模块完成 | 古典轻音乐 | 30秒 | 30% |
| 架构优化 | 系统架构改进 | 古典轻音乐 | 30秒 | 30% |
| 版本发布 | 版本标签推送 | 古典轻音乐 | 30秒 | 30% |
| 代码重构 | 重构相关commit | 钢琴轻音乐 | 30秒 | 25% |
| 性能优化 | 性能提升相关 | 钢琴轻音乐 | 30秒 | 25% |
| Bug修复 | 修复相关commit | 钢琴轻音乐 | 30秒 | 25% |
| 文档更新 | README/文档修改 | 自然轻音乐 | 30秒 | 20% |
| 配置调整 | 配置文件修改 | 自然轻音乐 | 30秒 | 20% |
| 测试完成 | 测试相关操作 | 自然轻音乐 | 30秒 | 20% |

---

## 📊 升级版开发进度模板

### 建议的 `README.md` 实时进度板块模板

```markdown
## 实时开发进度 | Real-time Development Progress

| 实时时间 | 模块/文件 | 优化/开发内容 | 状态 | 量化指标 | 技术要点 | 备注 |
|----------|-----------|---------------|------|----------|----------|------|
| 2025-01-13 14:32:15 | src/data_analysis.py | 优化RFM客户分析算法 | ✅ 已完成 | 性能提升35% | 使用vectorization优化计算 | 支持10万+客户数据 |
| 2025-01-13 15:48:23 | web/chart_module.js | 新增交互式图表动画 | ✅ 已完成 | 加载速度提升50% | 使用Chart.js 4.0 API | 支持6种图表类型 |
| 2025-01-13 16:15:07 | tests/test_rfm.py | 完善RFM模块单元测试 | 🔄 进行中 | 覆盖率达到85% | pytest + mock | 预计17:00完成 |
| 2025-01-13 16:45:00 | docs/api_guide.md | API接口文档编写 | ⏳ 待开始 | - | RESTful API设计 | 优先级：高 |
```

### 状态图标说明
- ✅ **已完成**: 功能开发完成，测试通过，已推送到仓库
- 🔄 **进行中**: 正在开发或测试阶段
- ⏳ **待开始**: 已规划但尚未开始的任务
- ⚠️ **存在问题**: 遇到技术难点或需要额外关注的任务
- 🚫 **已暂停**: 由于依赖或优先级调整而暂停的任务

---

## 🛠 进阶自动化建议

### 实时时间记录脚本
创建自动化脚本来简化时间记录过程：

```bash
#!/bin/bash
# 文件名: update_progress.sh

# 获取当前实时时间
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')

# 自动提交并推送更改
git add .
git commit -m "开发进度更新 - $CURRENT_TIME"
git push

echo "✅ 开发进度已更新并推送到远程仓库"
echo "📅 更新时间: $CURRENT_TIME"

# 设置轻音乐资源库
setup_light_music_library

# 根据时间和任务类型播放30秒轻音乐提醒
HOUR=$(date +%H)
if [[ $HOUR -ge 22 || $HOUR -le 8 ]]; then
    echo "🌙 深夜模式：播放轻柔自然音效..."
    timeout 10 play_nature_music_reminder
else
    echo "🎶 播放30秒舒缓轻音乐提醒..."
    play_smart_light_music "daily"
    say "开发进度更新完成，请回来查看更新内容！" --voice="Sin-ji" --rate=160
fi
```

### 30秒轻音乐提醒增强脚本
创建专用的30秒轻音乐提醒脚本：

```bash
#!/bin/bash
# 文件名: light_music_notify.sh

TASK_TYPE="${1:-daily}"
MESSAGE="${2:-任务已完成，请回来确认检查}"

# 根据任务类型选择不同的轻音乐
case $TASK_TYPE in
    "achievement")
        MUSIC_FILE="/Users/mac/Music/LightMusic/classical_achievement.mp3"
        VOLUME="30"
        ;;
    "optimization")
        MUSIC_FILE="/Users/mac/Music/LightMusic/piano_optimization.mp3"
        VOLUME="25"
        ;;
    "daily")
        MUSIC_FILE="/Users/mac/Music/LightMusic/nature_daily.mp3"
        VOLUME="20"
        ;;
    *)
        MUSIC_FILE="/Users/mac/Music/LightMusic/nature_daily.mp3"
        VOLUME="20"
        ;;
esac

# 检查当前时间，决定提醒强度
HOUR=$(date +%H)
if [ $HOUR -ge 9 ] && [ $HOUR -le 18 ]; then
    # 工作时间 - 正常音量
    VOLUME_MULTIPLIER="1.0"
else
    # 非工作时间 - 降低音量
    VOLUME_MULTIPLIER="0.5"
fi

# 播放30秒轻音乐提醒
if [[ -f "$MUSIC_FILE" ]]; then
    echo "🎵 播放30秒轻音乐: $MUSIC_FILE"
    osascript -e "set volume output volume $(echo "$VOLUME * $VOLUME_MULTIPLIER" | bc)"
    timeout 30 afplay "$MUSIC_FILE" &
else
    echo "🎶 音乐文件不存在，使用自然音效组合..."
    play_nature_music_reminder
fi

echo "🔔 30秒轻音乐提醒已播放: $MESSAGE"
```

## 🎵 轻音乐推荐清单
为了获得最佳的30秒轻音乐体验，推荐以下音乐类型：

### 🎼 古典轻音乐（重大成就）
- 巴赫：《G弦上的咏叹调》片段
- 帕赫贝尔：《卡农》片段  
- 德彪西：《月光》片段
- 维瓦尔迪：《四季》春之片段

### 🎹 钢琴轻音乐（代码优化）
- 肖邦：《雨滴前奏曲》片段
- 德彪西：《阿拉伯风格曲》片段
- 萨蒂：《吉诺佩蒂》片段
- 爱因奥迪：《黄昏》片段

### 🎶 自然轻音乐（日常任务）
- 班德瑞：《寂静山林》片段
- 神秘园：《夜曲》片段
- 久石让：《天空之城》片段
- 雅尼：《夜莺》片段

---

## 🎯 质量控制标准

### 代码质量要求
1. **代码覆盖率**: 单元测试覆盖率不低于80%
2. **性能基准**: 关键功能性能提升需量化记录
3. **文档完整性**: 每个新功能必须有相应的文档说明
4. **版本兼容性**: 确保向后兼容性，记录breaking changes

### 实时审查机制
- **每日代码审查**: 审查当日所有提交的代码质量
- **周度进度总结**: 每周总结开发进度和遇到的技术难点  
- **月度架构评估**: 每月评估整体架构和技术选型的合理性

---

## 📋 检查清单 | Checklist

在每次开发迭代后，请确认以下检查项：

- [ ] 使用实时系统时间记录开发进度（格式: YYYY-MM-DD HH:MM:SS）
- [ ] 在README.md中详细记录优化内容和量化指标
- [ ] 执行完整的git提交流程（add → commit → push）
- [ ] 提交信息包含模块名称和时间戳
- [ ] 验证远程仓库已成功更新
- [ ] **播放30秒对应类型的轻音乐提醒**
- [ ] 检查其他模块是否需要相应调整
- [ ] 确认代码质量和测试覆盖率
- [ ] 更新相关文档和API说明
- [ ] 规划下一个开发目标和优先级
- [ ] 确认30秒轻音乐提醒系统正常工作

---

## 📞 技术支持与协作

- **代码审查**: 每个重要功能需要至少一次peer review
- **技术讨论**: 使用GitHub Issues进行技术问题讨论
- **进度同步**: 团队成员定期同步开发进度和技术决策
- **知识分享**: 定期分享技术心得和最佳实践

---

> **重要提醒**: 本规则文件应纳入项目根目录，所有团队成员必须严格遵守。实时时间记录是确保项目透明度和可追溯性的关键要求。

---

**最后更新时间**: 2025-01-13 18:30:45  
**规则版本**: v4.0 - 30秒轻音乐提醒系统增强版 