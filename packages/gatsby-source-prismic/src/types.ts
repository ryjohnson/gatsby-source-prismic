import * as gatsby from 'gatsby'
import * as gatsbyImgix from 'gatsby-plugin-imgix'
import * as gqlc from 'graphql-compose'
import * as RTE from 'fp-ts/ReaderTaskEither'
import * as PrismicDOM from 'prismic-dom'
import Prismic from 'prismic-javascript'
import { Document as _PrismicAPIDocument } from 'prismic-javascript/types/documents'
import { QueryOptions as _PrismicClientQueryOptions } from 'prismic-javascript/types/ResolvedApi'
import { NodeHelpers } from 'gatsby-node-helpers'

import { TypePathsStoreInstance } from './typePaths'

export type ResolveType<T> = T extends PromiseLike<infer U> ? U : T

type UnknownRecord<K extends PropertyKey = PropertyKey> = Record<K, unknown>

export type JoiValidationError = InstanceType<
  gatsby.PluginOptionsSchemaArgs['Joi']['ValidationError']
>

export type TypePathsStore = Record<string, PrismicTypePathType>

export interface Dependencies {
  createTypePath: TypePathsStoreInstance['set']
  getTypePath: TypePathsStoreInstance['get']
  serializeTypePathStore: TypePathsStoreInstance['serialize']
  createTypes: gatsby.Actions['createTypes']
  createNode: gatsby.Actions['createNode']
  buildObjectType: gatsby.NodePluginSchema['buildObjectType']
  buildUnionType: gatsby.NodePluginSchema['buildUnionType']
  buildEnumType: gatsby.NodePluginSchema['buildEnumType']
  getNode: gatsby.SourceNodesArgs['getNode']
  getNodes: gatsby.SourceNodesArgs['getNodes']
  touchNode: gatsby.Actions['touchNode']
  deleteNode: gatsby.Actions['deleteNode']
  cache: gatsby.GatsbyCache
  reportInfo: gatsby.Reporter['info']
  reportWarning: gatsby.Reporter['warn']
  globalNodeHelpers: NodeHelpers
  nodeHelpers: NodeHelpers
  pluginOptions: PluginOptions
  webhookBody?: unknown
}

export interface PluginOptions extends gatsby.PluginOptions {
  repositoryName: string
  accessToken?: string
  apiEndpoint?: string
  releaseID?: string
  graphQuery?: string
  fetchLinks?: string[]
  lang: string
  linkResolver?: (doc: PrismicAPIDocument) => string
  htmlSerializer?: typeof PrismicDOM.HTMLSerializer
  schemas: Record<string, PrismicSchema>
  imageImgixParams: gatsbyImgix.ImgixUrlParams
  imagePlaceholderImgixParams: gatsbyImgix.ImgixUrlParams
  shouldDownloadImage?: (args: ShouldDownloadImageArgs) => boolean
  typePrefix?: string
  webhookSecret?: string
  plugins: []
}

type ShouldDownloadImageArgs = {
  node: PrismicAPIDocument
  key: string
  value: string
}

export type FieldConfigCreator<
  TSchema extends PrismicSchemaField = PrismicSchemaField
> = (
  path: string[],
  schema: TSchema,
) => RTE.ReaderTaskEither<
  Dependencies,
  never,
  gqlc.ComposeFieldConfig<unknown, unknown>
>

export interface PrismicAPIDocument<
  TData extends UnknownRecord<string> = UnknownRecord<string>
> extends _PrismicAPIDocument {
  data: TData
}

export interface PrismicSchema {
  [tabName: string]: PrismicSchemaTab
}

interface PrismicSchemaTab {
  [fieldName: string]: PrismicSchemaField
}

export type PrismicSchemaField =
  | PrismicSchemaStandardField
  | PrismicSchemaImageField
  | PrismicSchemaGroupField
  | PrismicSchemaSlicesField

export type PrismicTypePathType = PrismicSpecialType | PrismicFieldType

export enum PrismicSpecialType {
  Document = 'Document',
  DocumentData = 'DocumentData',
  Unknown = 'Unknown',
}

export enum PrismicFieldType {
  Boolean = 'Boolean',
  Color = 'Color',
  Date = 'Date',
  Embed = 'Embed',
  GeoPoint = 'GeoPoint',
  Image = 'Image',
  Link = 'Link',
  Number = 'Number',
  Select = 'Select',
  StructuredText = 'StructuredText',
  Text = 'Text',
  Timestamp = 'Timestamp',
  UID = 'UID',
  Group = 'Group',
  Slice = 'Slice',
  Slices = 'Slices',
}

interface PrismicSchemaStandardField {
  type: Exclude<PrismicFieldType, 'Image' | 'Group' | 'Slice' | 'Slices'>
  config: {
    label?: string
    placeholder?: string
  }
}

export interface PrismicSchemaImageField {
  type: PrismicFieldType.Image
  config: {
    label?: string
    thumbnails?: PrismicSchemaImageThumbnail[]
  }
}

export interface PrismicSchemaImageThumbnail {
  name: string
  width?: number
  height?: number
}

export interface PrismicSchemaGroupField {
  type: PrismicFieldType.Group
  config: {
    label?: string
    placeholder?: string
    fields: Record<string, PrismicSchemaStandardField>
  }
}

export interface PrismicSchemaSlicesField {
  type: PrismicFieldType.Slices
  config: {
    labels?: Record<string, string[]>
    choices: Record<string, PrismicSchemaSlice>
  }
}

export interface PrismicSchemaSlice {
  type: PrismicFieldType.Slice
  'non-repeat': Record<string, PrismicSchemaStandardField>
  repeat: Record<string, PrismicSchemaStandardField>
}

export type PrismicClient = ResolveType<ReturnType<typeof Prismic.getApi>>
export type PrismicClientQueryOptions = _PrismicClientQueryOptions

export type PrismicAPILinkField = {
  link_type: 'Any' | 'Document' | 'Media' | 'Web'
  isBroken: boolean
  url?: string
  target?: string
  size?: number
  id?: string
  type?: string
  tags?: string[]
  lang?: string
  slug?: string
  uid?: string
}

export type PrismicAPIImageField = {
  dimensions: { width: number; height: number }
  alt: string | null
  copyright: string | null
  url: string
  [key: string]: unknown
}

export type PrismicAPIStructuredTextField = {
  type: string
  text: string
  spans: { [key: string]: unknown }
}[]

export interface PrismicAPIDocumentNode
  extends PrismicAPIDocument,
    gatsby.Node {
  prismicId: string
}

export type PrismicAPISliceField = {
  slice_type: string
  slice_label: string
  items: UnknownRecord[]
  primary: UnknownRecord
}

export type PrismicWebhookBody =
  | PrismicWebhookBodyApiUpdate
  | PrismicWebhookBodyTestTrigger

export enum PrismicWebhookType {
  APIUpdate = 'api-update',
  TestTrigger = 'test-trigger',
}

interface PrismicWebhookBodyBase {
  type: PrismicWebhookType
  domain: string
  apiUrl: string
  secret: string | null
}

export interface PrismicWebhookBodyApiUpdate extends PrismicWebhookBodyBase {
  type: PrismicWebhookType.APIUpdate
  masterRef?: string
  releases: PrismicWebhookOperations<PrismicWebhookRelease>
  masks: PrismicWebhookOperations<PrismicWebhookMask>
  tags: PrismicWebhookOperations<PrismicWebhookTag>
  documents: string[]
  experiments?: PrismicWebhookOperations<PrismicWebhookExperiment>
}

export interface PrismicWebhookBodyTestTrigger extends PrismicWebhookBodyBase {
  type: PrismicWebhookType.TestTrigger
}

interface PrismicWebhookOperations<T> {
  update?: T[]
  addition?: T[]
  deletion?: T[]
}

interface PrismicWebhookMask {
  id: string
  label: string
}

interface PrismicWebhookTag {
  id: string
}

export interface PrismicWebhookRelease {
  id: string
  ref: string
  label: string
  documents: string[]
}

/**
 * @deprecated
 */
interface PrismicWebhookExperiment {
  id: string
  name: string
  variations: PrismicWebhookExperimentVariation[]
}

/**
 * @deprecated
 */
interface PrismicWebhookExperimentVariation {
  id: string
  ref: string
  label: string
}
