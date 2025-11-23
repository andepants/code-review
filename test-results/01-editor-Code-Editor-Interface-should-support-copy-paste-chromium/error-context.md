# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - heading "AI Code Review Assistant" [level=1] [ref=e5]
      - button "Settings" [ref=e6] [cursor=pointer]: ⚙️
    - generic [ref=e7]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - combobox "Programming language" [ref=e11]:
            - option "JavaScript" [selected]
            - option "TypeScript"
            - option "Python"
            - option "Java"
            - option "Go"
            - option "C++"
            - option "Rust"
            - option "Ruby"
            - option "PHP"
          - button "Clear" [ref=e12] [cursor=pointer]
        - code [ref=e16]:
          - generic [ref=e17]:
            - textbox "Editor content" [active]
            - textbox [ref=e18]
            - generic [ref=e23]: "1"
      - generic [ref=e35]:
        - generic [ref=e36]:
          - heading "Threads (0)" [level=2] [ref=e37]
          - combobox [ref=e38]:
            - option "All" [selected]
            - option "Active"
            - option "Resolved"
        - paragraph [ref=e42]: No threads yet
  - generic [ref=e43]:
    - alert
    - alert
```