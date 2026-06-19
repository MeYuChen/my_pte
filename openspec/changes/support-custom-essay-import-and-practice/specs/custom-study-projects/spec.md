# Capability: Custom Study Projects

## Requirement: Demo Package Compatibility

The application shall continue to load the existing 39-essay package as the default demo project.

### Scenario: First visit

- **Given** the user has no custom project data
- **When** the app loads
- **Then** the existing demo essays are available
- **And** existing template, article practice, exam, image, and progress behavior remains usable

## Requirement: Local Custom Project

The application shall allow a user to create a local study project without requiring an account.

### Scenario: Create project

- **Given** the user opens the import flow
- **When** the user enters a project name and saves
- **Then** a local project is created
- **And** it is available after page refresh

## Requirement: Template Import

The application shall allow a user to import a PTE WE template for a custom project.

### Scenario: Import four-paragraph template

- **Given** the user has a custom project
- **When** the user enters a four-paragraph WE template
- **Then** the template is saved to the project
- **And** it can be used for slot extraction

## Requirement: Essay Import

The application shall allow a user to import an essay into a custom project.

### Scenario: Import valid essay

- **Given** the user has a custom project and template
- **When** the user enters title, topic, position, and a four-paragraph essay
- **Then** the essay is saved as a custom article
- **And** the essay appears in the article list

### Scenario: Invalid paragraph count

- **Given** the user is importing an essay
- **When** the essay does not contain four paragraphs
- **Then** the app rejects the import
- **And** the user sees a clear validation message

## Requirement: Slot Extraction

The application shall extract memorization fields from imported essays when the essay follows a supported template.

### Scenario: Supported default template

- **Given** an imported essay follows the current default WE template
- **When** the app processes the essay
- **Then** it extracts fill-in fields equivalent to existing demo article practice

### Scenario: Extraction fallback

- **Given** an imported essay contains a sentence that does not match supported extraction rules
- **When** the app processes the essay
- **Then** the unmatched sentence is retained as an editable fallback practice field
- **And** the user can correct the generated field before practicing

## Requirement: Practice Integration

Imported essays shall be practiceable through the existing article practice flow.

### Scenario: Practice imported essay

- **Given** an imported essay appears in the article list
- **When** the user selects it in article practice mode
- **Then** the app renders fill-in fields for the imported essay
- **And** check/reveal/reset behavior works as it does for demo essays

## Requirement: Progress Isolation

Practice progress shall be stored separately for each project and essay.

### Scenario: Same essay title in two projects

- **Given** two projects contain essays with the same title
- **When** the user practices one essay
- **Then** progress updates only for that project and essay
